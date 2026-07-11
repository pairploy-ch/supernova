import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getLatestArticles } from '@/lib/supabase/queries/articles';
import { ARTICLE_CATEGORY_META } from '@/lib/articleCategory';
import { formatThaiDate } from '@/lib/formatDate';
import NewsCard from '@/components/news/NewsCard';

export default async function GuideTips() {
  const guides = await getLatestArticles(4, { category: 'gaming_gear' });

  return (
    <section style={{ background: '#fff', borderTop: '1px solid #eee' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="section-title-wrap pink">
          <h2>Guide &amp; Tips</h2>
          <Link href="/news?category=gaming_gear" style={{ color: 'var(--accent-pink)', border: '1px solid var(--accent-pink)' }} className="text-xs font-bold px-3 py-1 rounded flex items-center gap-1 hover:opacity-80 transition-opacity flex-shrink-0">
            More <ChevronRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {guides.map((article) => (
            <NewsCard
              key={article.id}
              slug={article.slug}
              tag={ARTICLE_CATEGORY_META[article.category].label}
              tagClass={ARTICLE_CATEGORY_META[article.category].tagClass}
              title={article.title}
              author={article.authorName}
              date={formatThaiDate(article.publishedAt)}
              imageUrl={article.coverImageUrl}
              compact
            />
          ))}
          {guides.length === 0 && (
            <p style={{ color: '#aaa', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '16px 0' }}>
              ยังไม่มีบทความ Guide &amp; Tips
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
