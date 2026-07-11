import { notFound } from 'next/navigation';
import { getArticleByIdForAdmin } from '@/lib/supabase/queries/articles';
import ArticleForm from '../../ArticleForm';
import { updateArticle } from '../../actions';

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleByIdForAdmin(id);
  if (!article) notFound();

  return (
    <div>
      <h1 className="text-xl font-medium mb-6" style={{ color: 'var(--text-primary)' }}>แก้ไขข่าว</h1>
      <div className="card p-6">
        <ArticleForm action={updateArticle} initial={article} />
      </div>
    </div>
  );
}
