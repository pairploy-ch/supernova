import Link from 'next/link';
import { ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { getPublishedArticles, getLatestArticles } from '@/lib/supabase/queries/articles';
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_META } from '@/lib/articleCategory';
import { formatThaiDate } from '@/lib/formatDate';
import type { ArticleCategory } from '@/lib/types';

function buildHref(category?: ArticleCategory, page?: number) {
  const params = new URLSearchParams();
  if (category) params.set('category', category);
  if (page && page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `/news?${qs}` : '/news';
}

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const category = ARTICLE_CATEGORIES.includes(sp.category as ArticleCategory)
    ? (sp.category as ArticleCategory)
    : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ articles, total, pageSize }, popular] = await Promise.all([
    getPublishedArticles({ category, page }),
    getLatestArticles(5),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      {/* Hero */}
      <div className="page-hero blue">
        <h1>{category ? ARTICLE_CATEGORY_META[category].filterLabel : 'Gaming News'}</h1>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / News
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter row */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <Link href={buildHref()} className={`tab-btn ${!category ? 'active' : ''}`}>
            ทั้งหมด
          </Link>
          {ARTICLE_CATEGORIES.map((c) => (
            <Link key={c} href={buildHref(c)} className={`tab-btn ${category === c ? 'active' : ''}`}>
              {ARTICLE_CATEGORY_META[c].filterLabel}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
          {/* Main feed */}
          <div>
            {articles.length === 0 && (
              <p className="text-sm py-16 text-center" style={{ color: 'var(--text-muted)' }}>
                ยังไม่มีข่าวในหมวดนี้
              </p>
            )}

            <div className="news-feed-grid">
              {articles.map((article) => (
                <Link key={article.id} href={`/news/${article.slug}`} className="news-feed-card">
                  <div className="img-wrap">
                    {article.coverImageUrl ? (
                      <img src={article.coverImageUrl} alt={article.title} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a0533, #0d0d2b)' }} />
                    )}
                    <span className={`tag ${ARTICLE_CATEGORY_META[article.category].tagClass}`}>
                      {ARTICLE_CATEGORY_META[article.category].label}
                    </span>
                  </div>
                  <h2>{article.title}</h2>
                  <div className="byline">
                    <div className="avatar-sm" style={{ width: '22px', height: '22px', fontSize: '9px' }}>
                      {article.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span>By {article.authorName}</span>
                    <span>|</span>
                    <span>{formatThaiDate(article.publishedAt)}</span>
                  </div>
                  {article.excerpt && <p className="excerpt">{article.excerpt}</p>}
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="page-nav mt-4">
                <Link
                  href={buildHref(category, Math.max(1, page - 1))}
                  className={`page-nav-arrow ${page <= 1 ? 'disabled' : ''}`}
                  aria-label="ก่อนหน้า"
                >
                  <ChevronLeft size={16} />
                </Link>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link key={p} href={buildHref(category, p)} className={`page-nav-item ${p === page ? 'active' : ''}`}>
                    {p}
                  </Link>
                ))}
                <Link
                  href={buildHref(category, Math.min(totalPages, page + 1))}
                  className={`page-nav-arrow ${page >= totalPages ? 'disabled' : ''}`}
                  aria-label="ถัดไป"
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card p-4">
              <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>บทความล่าสุด</h3>
              {popular.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="flex gap-3"
                  style={{ borderBottom: '1px solid var(--border-color)', padding: '10px 0' }}
                >
                  {article.coverImageUrl ? (
                    <img src={article.coverImageUrl} alt="" style={{ width: '56px', height: '44px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: '56px', height: '44px', borderRadius: '6px', flexShrink: 0, background: 'var(--bg-card)' }} />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold line-clamp-2" style={{ color: 'var(--text-primary)' }}>{article.title}</p>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{formatThaiDate(article.publishedAt)}</p>
                  </div>
                </Link>
              ))}
              {popular.length === 0 && (
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ยังไม่มีบทความ</p>
              )}
            </div>

            <div className="card p-4">
              <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>หมวดหมู่</h3>
              <div className="flex flex-wrap gap-2">
                {ARTICLE_CATEGORIES.map((c) => (
                  <Link key={c} href={buildHref(c)} className="tab-btn">
                    {ARTICLE_CATEGORY_META[c].filterLabel}
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/community" className="card p-4 block">
              <h3 className="font-bold text-sm mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <MessageSquare size={14} /> ไปที่ Community
              </h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>พูดคุยกับเกมเมอร์คนอื่นๆ</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
