import { createClient } from '@/lib/supabase/server';
import { logQueryError } from '@/lib/supabase/logError';

export async function getAdminCounts() {
  const supabase = await createClient();

  const [articles, published, threads, comments, users] = await Promise.all([
    supabase.from('articles').select('id', { count: 'exact', head: true }),
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('forum_threads').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('article_comments').select('id', { count: 'exact', head: true }),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalArticles: articles.count ?? 0,
    publishedArticles: published.count ?? 0,
    totalThreads: threads.count ?? 0,
    totalComments: comments.count ?? 0,
    totalUsers: users.count ?? 0,
  };
}

export interface AdminUserListItem {
  id: string;
  username: string;
  displayName: string | null;
  role: 'user' | 'admin';
  createdAt: string;
}

type AdminUserRow = {
  id: string;
  username: string;
  display_name: string | null;
  role: 'user' | 'admin';
  created_at: string;
};

export async function getAllUsersForAdmin(): Promise<AdminUserListItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, role, created_at')
    .order('created_at', { ascending: false });
  logQueryError('getAllUsersForAdmin', error);

  return ((data ?? []) as unknown as AdminUserRow[]).map((row) => ({
    id: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role,
    createdAt: row.created_at,
  }));
}
