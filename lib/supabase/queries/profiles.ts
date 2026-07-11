import { createClient } from '@/lib/supabase/server';
import { publicStorageUrl } from '@/lib/supabase/storage';
import { logQueryError } from '@/lib/supabase/logError';
import type { PublicProfile, AvatarFrame } from '@/lib/types';
import type { GameCode } from '@/lib/games';

type ProfileRow = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  cover_image_url: string | null;
  avatar_frame: string | null;
  bio: string | null;
  game_ids: Partial<Record<GameCode, string>> | null;
  created_at: string;
};

function mapProfile(row: ProfileRow): PublicProfile {
  return {
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    avatarUrl: publicStorageUrl('avatars', row.avatar_url),
    coverImageUrl: publicStorageUrl('avatars', row.cover_image_url),
    avatarFrame: (row.avatar_frame as AvatarFrame) ?? 'none',
    bio: row.bio,
    gameIds: row.game_ids ?? {},
    createdAt: row.created_at,
  };
}

export async function getProfileByUsername(username: string): Promise<PublicProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, cover_image_url, avatar_frame, bio, game_ids, created_at')
    .eq('username', username)
    .maybeSingle();
  logQueryError('getProfileByUsername', error);
  return data ? mapProfile(data as ProfileRow) : null;
}

export async function isUsernameTaken(username: string): Promise<boolean> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('profiles').select('id').eq('username', username).maybeSingle();
  logQueryError('isUsernameTaken', error);
  return !!data;
}

export interface UserStats {
  threadCount: number;
  replyCount: number;
  commentCount: number;
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const supabase = await createClient();
  const [threads, replies, comments] = await Promise.all([
    supabase.from('forum_threads').select('id', { count: 'exact', head: true }).eq('author_id', userId),
    supabase.from('forum_replies').select('id', { count: 'exact', head: true }).eq('author_id', userId),
    supabase.from('article_comments').select('id', { count: 'exact', head: true }).eq('author_id', userId),
  ]);
  logQueryError('getUserStats:threads', threads.error);
  logQueryError('getUserStats:replies', replies.error);
  logQueryError('getUserStats:comments', comments.error);
  return {
    threadCount: threads.count ?? 0,
    replyCount: replies.count ?? 0,
    commentCount: comments.count ?? 0,
  };
}
