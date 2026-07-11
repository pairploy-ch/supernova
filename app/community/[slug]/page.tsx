import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MessageSquare, Lock, ArrowLeft, PlusCircle } from 'lucide-react';
import { getThreadBySlug, getThreads, getReplies, incrementThreadView } from '@/lib/supabase/queries/forum';
import { GAMES } from '@/lib/games';
import { formatThaiDate, formatRelativeCompact, formatCompactNumber } from '@/lib/formatDate';
import { getCurrentUser } from '@/lib/dal';
import { stripMarkdown } from '@/lib/text';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ReplyForm from './ReplyForm';
import ReplyTree from './ReplyTree';

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const thread = await getThreadBySlug(slug);
  if (!thread) notFound();

  const [replies, user, threadsInGame] = await Promise.all([
    getReplies(thread.id),
    getCurrentUser(),
    getThreads({ gameCode: thread.gameCode }),
  ]);
  await incrementThreadView(thread.id);

  const game = GAMES[thread.gameCode];
  const suggestedThreads = threadsInGame.threads.filter((t) => t.id !== thread.id).slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <h1 style={{ fontSize: '22px' }}>{thread.title}</h1>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/community">Community</Link> / {game.name}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <Link href="/community" className="btn-secondary text-sm">
            <ArrowLeft size={14} /> Forums Home
          </Link>
          <Link href="/community/new" className="btn-primary text-sm" style={{ background: 'var(--accent-pink)' }}>
            <PlusCircle size={14} /> Create Topic
          </Link>
        </div>

        {/* Stats row */}
        <div className="card mb-6 py-4" style={{ display: 'flex', justifyContent: 'center', gap: '32px', borderLeft: 'none', borderRight: 'none' }}>
          <div className="text-center">
            <div className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{thread.replyCount}</div>
            <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Replies</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-black" style={{ color: 'var(--text-primary)' }}>{thread.viewCount}</div>
            <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Views</div>
          </div>
        </div>

        {/* Original post */}
        <article className="card p-6 mb-6" style={{ borderLeft: 'none', borderRight: 'none' }}>
          <div className="flex gap-4">
            <div className="flex-shrink-0 text-center">
              <ProfileAvatar avatarUrl={thread.authorAvatarUrl} name={thread.authorName} frame={thread.authorAvatarFrame} size={56} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{thread.authorName}</span>
                <span className="pill-tag" style={{ background: 'var(--cat-blue)', color: 'white' }}>Original Poster</span>
                {thread.isLocked && (
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)' }}>
                    <Lock size={11} /> Locked
                  </span>
                )}
                <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>{formatThaiDate(thread.createdAt)}</span>
              </div>

              <div className="mt-3">
                <MarkdownRenderer>{thread.body}</MarkdownRenderer>
              </div>

              {thread.imageUrl && (
                <img src={thread.imageUrl} alt="" style={{ maxWidth: '100%', borderRadius: 0, marginTop: '16px' }} />
              )}
            </div>
          </div>
        </article>

        <section className="card p-6" style={{ borderLeft: 'none', borderRight: 'none' }}>
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <MessageSquare size={18} />
            Replies ({thread.replyCount})
          </h2>

          {thread.isLocked ? (
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              กระทู้นี้ถูกล็อกแล้ว ไม่สามารถตอบกลับได้
            </p>
          ) : user ? (
            <div className="mb-6">
              <ReplyForm threadId={thread.id} slug={thread.slug} />
            </div>
          ) : (
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              <Link href="/login" style={{ color: 'var(--cat-blue)', fontWeight: 600 }}>เข้าสู่ระบบ</Link> เพื่อตอบกลับกระทู้นี้
            </p>
          )}

          <ReplyTree replies={replies} threadId={thread.id} slug={thread.slug} />
        </section>

        {suggestedThreads.length > 0 && (
          <section className="mt-10">
            <div className="section-title-wrap purple" style={{ marginBottom: '16px' }}>
              <h2 style={{ color: '#111', fontWeight: 500, fontSize: '16px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                Suggested Topics
              </h2>
            </div>

            <div className="card overflow-hidden" style={{ borderLeft: 'none', borderRight: 'none' }}>
              <div className="forum-table-head">
                <span>Topic</span>
                <span>Category</span>
                <span>Users</span>
                <span>Replies</span>
                <span>Views</span>
                <span>Activity</span>
              </div>

              {suggestedThreads.map((t) => (
                <Link key={t.id} href={`/community/${t.slug}`} className="forum-table-row">
                  <div className="forum-table-topic">
                    <h3>
                      {t.isPinned && <Lock size={12} style={{ flexShrink: 0 }} />}
                      <span className="line-clamp-1">{t.title}</span>
                    </h3>
                    {t.body && <p className="line-clamp-1">{stripMarkdown(t.body)}</p>}
                  </div>

                  <div className="forum-table-category">
                    <span className="dot" style={{ background: GAMES[t.gameCode].accent }} />
                    <span style={{ color: GAMES[t.gameCode].accent }}>{GAMES[t.gameCode].name}</span>
                  </div>

                  <div className="forum-table-users">
                    <ProfileAvatar avatarUrl={t.authorAvatarUrl} name={t.authorName} frame={t.authorAvatarFrame} size={28} />
                  </div>

                  <div className="forum-table-replies num-col">{t.replyCount}</div>
                  <div className="forum-table-views num-col">{formatCompactNumber(t.viewCount)}</div>
                  <div className="forum-table-activity num-col">{formatRelativeCompact(t.createdAt)}</div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
