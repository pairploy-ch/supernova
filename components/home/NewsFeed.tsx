import Link from 'next/link';
import { getLatestArticles } from '@/lib/supabase/queries/articles';
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_META } from '@/lib/articleCategory';
import { formatThaiDate } from '@/lib/formatDate';

export default async function NewsFeed() {
  const newsItems = await getLatestArticles(8);

  return (
    <section style={{ background: '#fff', borderTop: '1px solid #eee' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 40px' }}>

        {/* Tab bar */}
        <div style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #eee', marginBottom: '24px', overflowX: 'auto' }}>
          <span
            style={{
              padding: '14px 18px', fontSize: '13px', fontWeight: 700,
              color: 'var(--cat-blue)', borderBottom: '2px solid var(--cat-blue)', marginBottom: '-2px',
              whiteSpace: 'nowrap',
            }}
          >
            🔥 ล่าสุด
          </span>
          {ARTICLE_CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/news?category=${c}`}
              style={{
                padding: '14px 18px', fontSize: '13px', fontWeight: 700,
                color: '#555', textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              {ARTICLE_CATEGORY_META[c].filterLabel}
            </Link>
          ))}
        </div>

        {/* 4-col grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {newsItems.map((item) => (
            <Link
              key={item.id}
              href={`/news/${item.slug}`}
              className="news-card-link"
              style={{ display: 'block', textDecoration: 'none', borderRadius: '8px', overflow: 'hidden', background: '#fff', border: '1px solid #eee' }}
            >
              {/* Thumbnail */}
              <div style={{ position: 'relative', height: '160px', overflow: 'hidden', background: '#1a1a2e' }}>
                {item.coverImageUrl ? (
                  <img src={item.coverImageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--bg-card)' }} />
                )}
                <span
                  className={`tag ${ARTICLE_CATEGORY_META[item.category].tagClass}`}
                  style={{ position: 'absolute', bottom: '8px', left: '8px' }}
                >
                  {ARTICLE_CATEGORY_META[item.category].label}
                </span>
              </div>

              {/* Body */}
              <div style={{ padding: '12px' }}>
                <h3 style={{
                  color: '#111', fontWeight: 700, fontSize: '13px',
                  lineHeight: 1.4, margin: '0 0 6px',
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p style={{
                    color: '#888', fontSize: '11px', lineHeight: 1.55,
                    margin: '0 0 8px',
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>
                    {item.excerpt}
                  </p>
                )}
                <p style={{ color: '#aaa', fontSize: '10px', margin: 0 }}>
                  by <span style={{ color: 'var(--cat-blue)', fontWeight: 700 }}>{item.authorName}</span>
                  {' '}| {formatThaiDate(item.publishedAt)}
                </p>
              </div>
            </Link>
          ))}
          {newsItems.length === 0 && (
            <p style={{ color: '#aaa', fontSize: '13px', gridColumn: '1 / -1', textAlign: 'center', padding: '32px 0' }}>
              ยังไม่มีข่าว
            </p>
          )}
        </div>

      </div>
    </section>
  );
}
