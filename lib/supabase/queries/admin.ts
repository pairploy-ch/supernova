import { createClient } from '@/lib/supabase/server';

export async function getAdminCounts() {
  const supabase = await createClient();

  const [articles, published, threads, comments] = await Promise.all([
    supabase.from('articles').select('id', { count: 'exact', head: true }),
    supabase.from('articles').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('forum_threads').select('id', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('article_comments').select('id', { count: 'exact', head: true }),
  ]);

  return {
    totalArticles: articles.count ?? 0,
    publishedArticles: published.count ?? 0,
    totalThreads: threads.count ?? 0,
    totalComments: comments.count ?? 0,
  };
}
