import { createClient } from '@/lib/supabase/server';
import { publicStorageUrl } from '@/lib/supabase/storage';
import { logQueryError } from '@/lib/supabase/logError';
import type { ForumThread, ForumReply } from '@/lib/types';
import type { GameCode } from '@/lib/games';

const PAGE_SIZE = 20;

type ThreadRow = {
  id: string;
  slug: string;
  title: string;
  body: string;
  game_code: GameCode;
  author_id: string | null;
  image_path: string | null;
  is_pinned: boolean;
  is_locked: boolean;
  reply_count: number;
  view_count: number;
  created_at: string;
  profiles: { display_name: string | null; username: string } | null;
};

const THREAD_COLUMNS =
  'id, slug, title, body, game_code, author_id, image_path, is_pinned, is_locked, reply_count, view_count, created_at, profiles(display_name, username)';

function mapThread(row: ThreadRow): ForumThread {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    body: row.body,
    gameCode: row.game_code,
    authorId: row.author_id,
    authorName: row.profiles?.display_name || row.profiles?.username || 'Supernova',
    imageUrl: publicStorageUrl('forum-attachments', row.image_path),
    isPinned: row.is_pinned,
    isLocked: row.is_locked,
    replyCount: row.reply_count,
    viewCount: row.view_count,
    createdAt: row.created_at,
  };
}

export async function getThreads(
  opts: { gameCode?: GameCode; page?: number } = {}
): Promise<{ threads: ForumThread[]; total: number; pageSize: number }> {
  const supabase = await createClient();
  const page = opts.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('forum_threads')
    .select(THREAD_COLUMNS, { count: 'exact' })
    .is('deleted_at', null)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (opts.gameCode) query = query.eq('game_code', opts.gameCode);

  const { data, count, error } = await query;
  logQueryError('getThreads', error);
  return {
    threads: ((data ?? []) as unknown as ThreadRow[]).map(mapThread),
    total: count ?? 0,
    pageSize: PAGE_SIZE,
  };
}

export async function getHotThreads(limit: number): Promise<ForumThread[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('forum_threads')
    .select(THREAD_COLUMNS)
    .is('deleted_at', null)
    .order('view_count', { ascending: false })
    .limit(limit);
  logQueryError('getHotThreads', error);
  return ((data ?? []) as unknown as ThreadRow[]).map(mapThread);
}

export async function getThreadBySlug(slug: string): Promise<ForumThread | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('forum_threads')
    .select(THREAD_COLUMNS)
    .eq('slug', slug)
    .is('deleted_at', null)
    .maybeSingle();
  logQueryError('getThreadBySlug', error);
  return data ? mapThread(data as unknown as ThreadRow) : null;
}

export interface AdminThreadListItem {
  id: string;
  slug: string;
  title: string;
  gameCode: GameCode;
  authorName: string;
  isPinned: boolean;
  isLocked: boolean;
  isDeleted: boolean;
  replyCount: number;
  createdAt: string;
}

type AdminThreadRow = {
  id: string;
  slug: string;
  title: string;
  game_code: GameCode;
  is_pinned: boolean;
  is_locked: boolean;
  deleted_at: string | null;
  reply_count: number;
  created_at: string;
  profiles: { display_name: string | null; username: string } | null;
};

export async function getAllThreadsForAdmin(): Promise<AdminThreadListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('forum_threads')
    .select(
      'id, slug, title, game_code, is_pinned, is_locked, deleted_at, reply_count, created_at, profiles(display_name, username)'
    )
    .order('created_at', { ascending: false });
  logQueryError('getAllThreadsForAdmin', error);

  return ((data ?? []) as unknown as AdminThreadRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    gameCode: row.game_code,
    authorName: row.profiles?.display_name || row.profiles?.username || 'Supernova',
    isPinned: row.is_pinned,
    isLocked: row.is_locked,
    isDeleted: !!row.deleted_at,
    replyCount: row.reply_count,
    createdAt: row.created_at,
  }));
}

export async function incrementThreadView(threadId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc('increment_thread_view', { p_thread_id: threadId });
  logQueryError('incrementThreadView', error);
}

type ReplyRow = {
  id: string;
  thread_id: string;
  parent_reply_id: string | null;
  author_id: string | null;
  body: string;
  image_path: string | null;
  created_at: string;
  profiles: { username: string; display_name: string | null; avatar_url: string | null } | null;
};

export async function getReplies(threadId: string): Promise<ForumReply[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('forum_replies')
    .select(
      'id, thread_id, parent_reply_id, author_id, body, image_path, created_at, profiles(username, display_name, avatar_url)'
    )
    .eq('thread_id', threadId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });
  logQueryError('getReplies', error);

  const flat: ForumReply[] = ((data ?? []) as unknown as ReplyRow[]).map((row) => ({
    id: row.id,
    threadId: row.thread_id,
    parentReplyId: row.parent_reply_id,
    authorId: row.author_id,
    authorName: row.profiles?.display_name || row.profiles?.username || 'ผู้ใช้',
    authorAvatarUrl: publicStorageUrl('avatars', row.profiles?.avatar_url),
    imageUrl: publicStorageUrl('forum-attachments', row.image_path),
    body: row.body,
    createdAt: row.created_at,
    children: [],
  }));

  // Build the reply tree from the flat, chronologically-ordered list.
  const byId = new Map(flat.map((reply) => [reply.id, reply]));
  const roots: ForumReply[] = [];
  for (const reply of flat) {
    if (reply.parentReplyId && byId.has(reply.parentReplyId)) {
      byId.get(reply.parentReplyId)!.children.push(reply);
    } else {
      roots.push(reply);
    }
  }
  return roots;
}
