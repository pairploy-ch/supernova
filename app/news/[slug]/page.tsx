import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { getArticleBySlug, getArticleComments, getLatestArticles } from '@/lib/supabase/queries/articles';
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_META } from '@/lib/articleCategory';
import { formatThaiDate } from '@/lib/formatDate';
import { getCurrentUser } from '@/lib/dal';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import NewsCard from '@/components/news/NewsCard';
import AdBanner from '@/components/AdBanner';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import CommentForm from './CommentForm';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [comments, user, related, popular] = await Promise.all([
    getArticleComments(article.id),
    getCurrentUser(),
    getLatestArticles(4, { category: article.category }),
    getLatestArticles(5),
  ]);
  const relatedArticles = related.filter((a) => a.id !== article.id).slice(0, 3);
  const popularArticles = popular.filter((a) => a.id !== article.id).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* Main */}
        <div>
          <article className="mb-8">
            <div
              style={{
                background: article.coverImageUrl
                  ? `url(${article.coverImageUrl}) center/cover`
                  : 'linear-gradient(135deg, #1a0533, #0d0d2b)',
                height: '280px',
              }}
            />
            <div className="py-6">
              <span className={`tag ${ARTICLE_CATEGORY_META[article.category].tagClass} mb-3 inline-block`}>
                {ARTICLE_CATEGORY_META[article.category].label}
              </span>
              <h1 className="text-2xl md:text-3xl font-medium mb-3" style={{ color: 'var(--text-primary)' }}>
                {article.title}
              </h1>
              <div className="flex items-center gap-3 mb-6">
                <div className="avatar-sm" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
                  {article.authorName.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  By <strong style={{ color: 'var(--text-primary)' }}>{article.authorName}</strong> | {formatThaiDate(article.publishedAt)}
                </span>
                <a href="#comments" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--accent-pink)' }}>
                  <MessageSquare size={12} /> {comments.length} Comments
                </a>
              </div>

              <MarkdownRenderer>{article.body}</MarkdownRenderer>
            </div>
          </article>

          {relatedArticles.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-medium mb-4" style={{ color: 'var(--text-primary)' }}>ข่าวที่เกี่ยวข้อง</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {relatedArticles.map((a) => (
                  <NewsCard
                    key={a.id}
                    slug={a.slug}
                    tag={ARTICLE_CATEGORY_META[a.category].label}
                    tagClass={ARTICLE_CATEGORY_META[a.category].tagClass}
                    title={a.title}
                    author={a.authorName}
                    date={formatThaiDate(a.publishedAt)}
                    imageUrl={a.coverImageUrl}
                    compact
                  />
                ))}
              </div>
            </section>
          )}

          <section id="comments" className="pt-6 scroll-mt-20" style={{ borderTop: '1px solid var(--border-color)' }}>
            <div className="section-title-wrap pink" style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#111', fontWeight: 500, fontSize: '16px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                เขียนความคิดเห็น
              </h2>
            </div>

            {user ? (
              <div className="mb-10">
                <CommentForm articleId={article.id} slug={article.slug} />
              </div>
            ) : (
              <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>
                <Link href="/login" style={{ color: 'var(--accent-pink)', fontWeight: 600 }}>
                  เข้าสู่ระบบ
                </Link>{' '}
                เพื่อแสดงความคิดเห็น
              </p>
            )}

            <div className="section-title-wrap pink" style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#111', fontWeight: 500, fontSize: '16px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                <MessageSquare size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: '-2px' }} />
                ความคิดเห็น ({comments.length})
              </h2>
            </div>

            <div>
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3" style={{ borderTop: '1px solid var(--border-color)', padding: '18px 0' }}>
                  <ProfileAvatar avatarUrl={comment.authorAvatarUrl} name={comment.authorName} frame={comment.authorAvatarFrame} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                        {comment.authorName}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {formatThaiDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>
                      {comment.body}
                    </p>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-sm py-6" style={{ color: 'var(--text-muted)' }}>
                  ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็น!
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <AdBanner />

          <div className="p-4">
            <div className="section-title-wrap pink" style={{ marginBottom: '16px' }}>
              <h3 style={{ color: '#111', fontWeight: 500, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                บทความล่าสุด
              </h3>
            </div>
            {popularArticles.map((a) => (
              <Link
                key={a.id}
                href={`/news/${a.slug}`}
                className="flex gap-3"
                style={{ borderBottom: '1px solid var(--border-color)', padding: '10px 0' }}
              >
                {a.coverImageUrl ? (
                  <img src={a.coverImageUrl} alt="" style={{ width: '56px', height: '44px', objectFit: 'cover', borderRadius: 0, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '56px', height: '44px', borderRadius: 0, flexShrink: 0, background: 'var(--bg-card)' }} />
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold line-clamp-2" style={{ color: 'var(--text-primary)' }}>{a.title}</p>
                  <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{formatThaiDate(a.publishedAt)}</p>
                </div>
              </Link>
            ))}
            {popularArticles.length === 0 && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ยังไม่มีบทความ</p>
            )}
          </div>

          <div className="p-4">
            <div className="section-title-wrap pink" style={{ marginBottom: '16px' }}>
              <h3 style={{ color: '#111', fontWeight: 500, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                หมวดหมู่
              </h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {ARTICLE_CATEGORIES.map((c) => (
                <Link
                  key={c}
                  href={`/news?category=${c}`}
                  className="tab-btn"
                  style={{ borderColor: ARTICLE_CATEGORY_META[c].hex, color: ARTICLE_CATEGORY_META[c].hex }}
                >
                  {ARTICLE_CATEGORY_META[c].filterLabel}
                </Link>
              ))}
            </div>
          </div>

          <Link href="/community" className="card p-4 block">
            <h3 className="font-medium text-sm mb-1 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <MessageSquare size={14} /> ไปที่ Community
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>พูดคุยกับเกมเมอร์คนอื่นๆ</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
