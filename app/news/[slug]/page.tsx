import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageSquare } from 'lucide-react';
import { getArticleBySlug, getArticleComments, getLatestArticles } from '@/lib/supabase/queries/articles';
import { ARTICLE_CATEGORY_META } from '@/lib/articleCategory';
import { formatThaiDate } from '@/lib/formatDate';
import { getCurrentUser } from '@/lib/dal';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import NewsCard from '@/components/news/NewsCard';
import CommentForm from './CommentForm';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const [comments, user, related] = await Promise.all([
    getArticleComments(article.id),
    getCurrentUser(),
    getLatestArticles(4, { category: article.category }),
  ]);
  const relatedArticles = related.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <article className="card overflow-hidden mb-8">
        <div
          style={{
            background: article.coverImageUrl
              ? `url(${article.coverImageUrl}) center/cover`
              : 'linear-gradient(135deg, #1a0533, #0d0d2b)',
            height: '280px',
          }}
        />
        <div className="p-6">
          <span className={`tag ${ARTICLE_CATEGORY_META[article.category].tagClass} mb-3 inline-block`}>
            {ARTICLE_CATEGORY_META[article.category].label}
          </span>
          <h1 className="text-2xl md:text-3xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
            {article.title}
          </h1>
          <div className="flex items-center gap-3 mb-6">
            <div className="avatar-sm" style={{ width: '28px', height: '28px', fontSize: '11px' }}>
              {article.authorName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              By <strong style={{ color: 'var(--text-primary)' }}>{article.authorName}</strong> | {formatThaiDate(article.publishedAt)}
            </span>
            <a href="#comments" className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--cat-blue)' }}>
              <MessageSquare size={12} /> {comments.length} Comments
            </a>
          </div>

          <MarkdownRenderer>{article.body}</MarkdownRenderer>
        </div>
      </article>

      {relatedArticles.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--text-primary)' }}>ข่าวที่เกี่ยวข้อง</h2>
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

      <section id="comments" className="card p-6 scroll-mt-20">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <MessageSquare size={18} />
          ความคิดเห็น ({comments.length})
        </h2>

        {user ? (
          <div className="mb-6">
            <CommentForm articleId={article.id} slug={article.slug} />
          </div>
        ) : (
          <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
            <Link href="/login" style={{ color: 'var(--cat-blue)', fontWeight: 600 }}>
              เข้าสู่ระบบ
            </Link>{' '}
            เพื่อแสดงความคิดเห็น
          </p>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
              <div
                className="avatar-sm"
                style={{
                  background: comment.authorAvatarUrl
                    ? `url(${comment.authorAvatarUrl}) center/cover`
                    : 'var(--gradient-hero)',
                }}
              >
                {!comment.authorAvatarUrl && comment.authorName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    {comment.authorName}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {formatThaiDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็น!
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
