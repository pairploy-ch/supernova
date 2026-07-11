import { createClient } from '@/lib/supabase/server';
import { publicStorageUrl } from '@/lib/supabase/storage';
import { logQueryError } from '@/lib/supabase/logError';
import type { Article, ArticleComment, ArticleCategory, AvatarFrame } from '@/lib/types';
import type { GameCode } from '@/lib/games';

const PAGE_SIZE = 12;

// No generated Database types (out of scope for a solo-dev project this size — see plan);
// the embedded `profiles` relation comes back untyped from postgrest-js, hence the casts below.
type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: ArticleCategory;
  game_code: GameCode | null;
  cover_image_path: string | null;
  published_at: string | null;
  profiles: { display_name: string | null; username: string } | null;
};

const ARTICLE_COLUMNS =
  'id, slug, title, excerpt, body, category, game_code, cover_image_path, published_at, profiles(display_name, username)';

function mapArticle(row: ArticleRow): Article {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    category: row.category,
    gameCode: row.game_code,
    coverImageUrl: publicStorageUrl('article-covers', row.cover_image_path),
    authorName: row.profiles?.display_name || row.profiles?.username || 'Supernova',
    publishedAt: row.published_at,
  };
}

export async function getPublishedArticles(
  opts: { category?: ArticleCategory; page?: number } = {}
): Promise<{ articles: Article[]; total: number; pageSize: number }> {
  const supabase = await createClient();
  const page = opts.page ?? 1;
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from('articles')
    .select(ARTICLE_COLUMNS, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to);

  if (opts.category) query = query.eq('category', opts.category);

  const { data, count, error } = await query;
  logQueryError('getPublishedArticles', error);
  return {
    articles: ((data ?? []) as unknown as ArticleRow[]).map(mapArticle),
    total: count ?? 0,
    pageSize: PAGE_SIZE,
  };
}

export async function getLatestArticles(
  limit: number,
  opts: { category?: ArticleCategory; gameCode?: GameCode } = {}
): Promise<Article[]> {
  const supabase = await createClient();
  let query = supabase
    .from('articles')
    .select(ARTICLE_COLUMNS)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (opts.category) query = query.eq('category', opts.category);
  if (opts.gameCode) query = query.eq('game_code', opts.gameCode);

  const { data, error } = await query;
  logQueryError('getLatestArticles', error);
  return ((data ?? []) as unknown as ArticleRow[]).map(mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select(ARTICLE_COLUMNS)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();
  logQueryError('getArticleBySlug', error);
  return data ? mapArticle(data as unknown as ArticleRow) : null;
}

export interface AdminArticleListItem {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  status: 'draft' | 'published';
  publishedAt: string | null;
}

type AdminArticleListRow = {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  status: 'draft' | 'published';
  published_at: string | null;
};

export async function getAllArticlesForAdmin(): Promise<AdminArticleListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, category, status, published_at')
    .order('created_at', { ascending: false });
  logQueryError('getAllArticlesForAdmin', error);
  return ((data ?? []) as unknown as AdminArticleListRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    status: row.status,
    publishedAt: row.published_at,
  }));
}

export interface AdminArticleDetail {
  id: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: ArticleCategory;
  status: 'draft' | 'published';
  coverImageUrl: string | null;
}

export async function getArticleByIdForAdmin(id: string): Promise<AdminArticleDetail | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, excerpt, body, category, status, cover_image_path')
    .eq('id', id)
    .maybeSingle();
  logQueryError('getArticleByIdForAdmin', error);
  if (!data) return null;
  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    category: data.category,
    status: data.status,
    coverImageUrl: publicStorageUrl('article-covers', data.cover_image_path),
  };
}

type CommentRow = {
  id: string;
  article_id: string;
  author_id: string | null;
  body: string;
  created_at: string;
  profiles: { username: string; display_name: string | null; avatar_url: string | null; avatar_frame: string | null } | null;
};

export async function getArticleComments(articleId: string): Promise<ArticleComment[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('article_comments')
    .select('id, article_id, author_id, body, created_at, profiles(username, display_name, avatar_url, avatar_frame)')
    .eq('article_id', articleId)
    .is('deleted_at', null)
    .order('created_at', { ascending: true });
  logQueryError('getArticleComments', error);

  return ((data ?? []) as unknown as CommentRow[]).map((row) => ({
    id: row.id,
    articleId: row.article_id,
    authorId: row.author_id,
    authorName: row.profiles?.display_name || row.profiles?.username || 'ผู้ใช้',
    authorAvatarUrl: publicStorageUrl('avatars', row.profiles?.avatar_url),
    authorAvatarFrame: (row.profiles?.avatar_frame as AvatarFrame) ?? 'none',
    body: row.body,
    createdAt: row.created_at,
  }));
}
