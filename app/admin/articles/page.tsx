import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { getAllArticlesForAdmin } from '@/lib/supabase/queries/articles';
import { ARTICLE_CATEGORY_META } from '@/lib/articleCategory';
import { formatThaiDate } from '@/lib/formatDate';
import DeleteArticleButton from './DeleteArticleButton';

export default async function AdminArticlesPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>จัดการข่าว</h1>
        <Link href="/admin/articles/new" className="btn-primary text-sm">
          <Plus size={14} /> เพิ่มข่าว
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div
          style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
          className="flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase"
        >
          <div className="flex-1">หัวข้อ</div>
          <div className="w-24">หมวด</div>
          <div className="w-20">สถานะ</div>
          <div className="w-24">วันที่</div>
          <div className="w-20 text-right">จัดการ</div>
        </div>

        {articles.map((article) => (
          <div key={article.id} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
            <div className="flex-1 min-w-0 text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {article.title}
            </div>
            <div className="w-24">
              <span className={`tag ${ARTICLE_CATEGORY_META[article.category].tagClass}`}>
                {ARTICLE_CATEGORY_META[article.category].label}
              </span>
            </div>
            <div className="w-20 text-xs" style={{ color: article.status === 'published' ? '#22c55e' : 'var(--text-muted)' }}>
              {article.status === 'published' ? 'เผยแพร่' : 'ร่าง'}
            </div>
            <div className="w-24 text-xs" style={{ color: 'var(--text-muted)' }}>
              {formatThaiDate(article.publishedAt)}
            </div>
            <div className="w-20 flex items-center justify-end gap-2">
              <Link href={`/admin/articles/${article.id}/edit`} style={{ color: 'var(--accent-pink)' }}>
                <Pencil size={15} />
              </Link>
              <DeleteArticleButton id={article.id} />
            </div>
          </div>
        ))}

        {articles.length === 0 && (
          <p className="text-sm py-10 text-center" style={{ color: 'var(--text-muted)' }}>ยังไม่มีข่าว</p>
        )}
      </div>
    </div>
  );
}
