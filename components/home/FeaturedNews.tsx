import Link from 'next/link';
import { getLatestArticles } from '@/lib/supabase/queries/articles';
import { ARTICLE_CATEGORY_META } from '@/lib/articleCategory';

export default async function FeaturedNews() {
  const [latest, events] = await Promise.all([
    getLatestArticles(4),
    getLatestArticles(9, { category: 'event' }),
  ]);
  const [big, ...rightCards] = latest;

  return (
    <section style={{ background: '#fff' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px' }}>

        {/* ── LEFT: big + 3 small ── */}
        {big && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto', gap: '4px', borderRadius: '10px', overflow: 'hidden' }}>

            {/* Big card — spans full height left */}
            <Link
              href={`/news/${big.slug}`}
              style={{
                gridRow: '1 / 4', position: 'relative', display: 'block', textDecoration: 'none',
                overflow: 'hidden', minHeight: '340px',
                background: big.coverImageUrl ? undefined : 'linear-gradient(135deg, #1a0533, #0d0d2b)',
              }}
            >
              {big.coverImageUrl && (
                <img
                  src={big.coverImageUrl}
                  alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.2) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px' }}>
                <span className={`tag ${ARTICLE_CATEGORY_META[big.category].tagClass}`}>
                  {ARTICLE_CATEGORY_META[big.category].label}
                </span>
                <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '22px', lineHeight: 1.2, margin: '10px 0 8px' }}>
                  {big.title}
                </h2>
                {big.excerpt && (
                  <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '12px', lineHeight: 1.6, margin: 0 }}>
                    {big.excerpt}
                  </p>
                )}
              </div>
            </Link>

            {/* 3 small cards — right column */}
            {rightCards.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.slug}`}
                style={{
                  position: 'relative', display: 'block', textDecoration: 'none',
                  overflow: 'hidden', minHeight: '112px',
                  background: article.coverImageUrl ? undefined : 'linear-gradient(135deg, #1a0533, #0d0d2b)',
                }}
              >
                {article.coverImageUrl && (
                  <img
                    src={article.coverImageUrl}
                    alt=""
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 50%, rgba(0,0,0,0.2) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 12px' }}>
                  <span className={`tag ${ARTICLE_CATEGORY_META[article.category].tagClass}`}>
                    {ARTICLE_CATEGORY_META[article.category].label}
                  </span>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '12px', lineHeight: 1.3, margin: '6px 0 0' }}>
                    {article.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── RIGHT: Social + Upcoming Events ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Social Media */}
          <div>
            <h3 style={{ color: '#111', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 16px' }}>
              SOCIAL MEDIA
            </h3>
            <div style={{ height: '2px', background: 'linear-gradient(90deg, #e91e8c, #f59e0b)', marginBottom: '16px', borderRadius: '2px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { bg: '#1877f2', label: 'f' },
                { bg: '#1da1f2', label: '🐦' },
                { bg: '#000', label: '⬛' },
                { bg: '#ff0050', label: '♪' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="social-icon"
                  style={{ background: s.bg, fontSize: '16px', color: 'white', fontWeight: 700 }}
                >
                  {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#111', fontWeight: 800, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: '0 0 12px' }}>
              UPCOMING EVENT
            </h3>
            <div style={{ height: '2px', background: 'linear-gradient(90deg, #e91e8c, #f59e0b)', marginBottom: '16px', borderRadius: '2px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {events.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  style={{
                    display: 'flex', gap: '10px', alignItems: 'flex-start',
                    padding: '10px 0',
                    borderBottom: '1px solid #f0f0f0',
                    textDecoration: 'none',
                  }}
                >
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt=""
                      style={{ width: '64px', height: '46px', objectFit: 'cover', borderRadius: '5px', flexShrink: 0 }}
                    />
                  ) : (
                    <div style={{ width: '64px', height: '46px', borderRadius: '5px', flexShrink: 0, background: 'var(--bg-card)' }} />
                  )}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: '#111', fontSize: '12px', fontWeight: 700, lineHeight: 1.35, margin: '0 0 3px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {article.title}
                    </p>
                    {article.excerpt && (
                      <p style={{ color: '#888', fontSize: '10px', margin: 0, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {article.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
              {events.length === 0 && (
                <p style={{ color: '#aaa', fontSize: '12px', padding: '8px 0' }}>ยังไม่มีอีเว้นท์เร็วๆ นี้</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
