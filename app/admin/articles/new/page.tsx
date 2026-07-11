import ArticleForm from '../ArticleForm';
import { createArticle } from '../actions';

export default function NewArticlePage() {
  return (
    <div>
      <h1 className="text-xl font-medium mb-6" style={{ color: 'var(--text-primary)' }}>เพิ่มข่าวใหม่</h1>
      <div className="card p-6">
        <ArticleForm action={createArticle} />
      </div>
    </div>
  );
}
