import Link from 'next/link';
import { MessageSquare, Eye, Flame, PlusCircle, Bell, Lock } from 'lucide-react';
import { getThreads, getHotThreads } from '@/lib/supabase/queries/forum';
import { GAMES_LIST, GAMES, type GameCode } from '@/lib/games';
import { formatRelativeCompact, formatCompactNumber } from '@/lib/formatDate';
import { stripMarkdown } from '@/lib/text';
import ProfileAvatar from '@/components/profile/ProfileAvatar';

function buildHref(gameCode?: GameCode, page?: number) {
  const params = new URLSearchParams();
  if (gameCode) params.set('game', gameCode);
  if (page && page > 1) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `/community?${qs}` : '/community';
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ game?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const gameCode = GAMES_LIST.some((g) => g.code === sp.game) ? (sp.game as GameCode) : undefined;
  const page = Math.max(1, Number(sp.page) || 1);

  const [{ threads, total, pageSize }, hotThreads] = await Promise.all([
    getThreads({ gameCode, page }),
    getHotThreads(5),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <h1>Supernova Forums</h1>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / Community
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="section-title" style={{ marginBottom: 0 }}>เลือกเกม</h2>

          <div className="flex items-center gap-3">
            {gameCode && (
              <Link href={buildHref()} className="text-xs font-semibold" style={{ color: 'var(--accent-pink)' }}>
                ดูทั้งหมด ✕
              </Link>
            )}
            <Link href="/community/new" className="btn-primary flex-shrink-0" style={{ background: 'var(--accent-pink)' }}>
              <PlusCircle size={16} />
              สร้างกระทู้ใหม่
            </Link>
          </div>
        </div>

        {/* Game filter cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {GAMES_LIST.map((g) => {
            const active = gameCode === g.code;
            return (
              <Link
                key={g.code}
                href={buildHref(active ? undefined : g.code)}
                className="card block relative overflow-hidden"
                style={{
                  height: '150px',
                  background: g.bg,
                  outline: active ? `2px solid ${g.accent}` : undefined,
                  outlineOffset: active ? '-2px' : undefined,
                }}
              >
                <div style={{ position: 'absolute', inset: 0, padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '30px', marginBottom: '6px' }}>{g.emoji}</div>
                  <div style={{ color: g.accent, fontSize: '10px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {g.subtitle}
                  </div>
                  <h3 className="text-white font-medium text-xl">{g.name}</h3>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main */}
          <div className="lg:col-span-3">
          {/* Threads */}
          <div className="card overflow-hidden">
            <div className="forum-table-head">
              <span>Topic</span>
              <span>Category</span>
              <span>Users</span>
              <span>Replies</span>
              <span>Views</span>
              <span>Activity</span>
            </div>

            {threads.map((thread) => (
              <Link key={thread.id} href={`/community/${thread.slug}`} className="forum-table-row">
                <div className="forum-table-topic">
                  <h3>
                    {thread.isPinned && <Bell size={13} style={{ color: 'var(--cat-blue)', flexShrink: 0 }} />}
                    {thread.isLocked && <Lock size={12} style={{ flexShrink: 0 }} />}
                    <span className="line-clamp-1">{thread.title}</span>
                    {thread.isPinned && <span className="pill-tag" style={{ background: 'var(--cat-blue)', color: 'white', flexShrink: 0 }}>Pinned</span>}
                  </h3>
                  {thread.body && <p className="line-clamp-1">{stripMarkdown(thread.body)}</p>}
                </div>

                <div className="forum-table-category">
                  <span className="dot" style={{ background: GAMES[thread.gameCode].accent }} />
                  <span style={{ color: GAMES[thread.gameCode].accent }}>{GAMES[thread.gameCode].name}</span>
                </div>

                <div className="forum-table-users">
                  <ProfileAvatar avatarUrl={thread.authorAvatarUrl} name={thread.authorName} frame={thread.authorAvatarFrame} size={28} />
                </div>

                <div className="forum-table-replies num-col">{thread.replyCount}</div>
                <div className="forum-table-views num-col">{formatCompactNumber(thread.viewCount)}</div>
                <div className="forum-table-activity num-col">{formatRelativeCompact(thread.createdAt)}</div>
              </Link>
            ))}

            {threads.length === 0 && (
              <p className="text-sm py-16 text-center" style={{ color: 'var(--text-muted)' }}>
                ยังไม่มีกระทู้ในหมวดนี้ เป็นคนแรกที่ตั้งกระทู้!
              </p>
            )}
          </div>

          {totalPages > 1 && (
            <div className="page-nav mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link key={p} href={buildHref(gameCode, p)} className={`page-nav-item ${p === page ? 'active' : ''}`}>
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-4">
            <h3 className="font-medium text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Flame size={14} style={{ color: 'var(--accent-pink)' }} />
              กระทู้ยอดนิยม
            </h3>
            {hotThreads.map((t) => (
              <Link key={t.id} href={`/community/${t.slug}`} style={{ borderBottom: '1px solid var(--border-color)', padding: '8px 0', display: 'block' }}>
                <p className="text-xs font-medium line-clamp-2 hover:opacity-70 transition-opacity" style={{ color: 'var(--text-primary)' }}>
                  {t.title}
                </p>
                <div className="flex gap-3 mt-1">
                  <span style={{ color: 'var(--text-muted)' }} className="text-[10px] flex items-center gap-1">
                    <Eye size={9} /> {t.viewCount}
                  </span>
                  <span style={{ color: 'var(--text-muted)' }} className="text-[10px] flex items-center gap-1">
                    <MessageSquare size={9} /> {t.replyCount}
                  </span>
                </div>
              </Link>
            ))}
            {hotThreads.length === 0 && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ยังไม่มีกระทู้</p>
            )}
          </div>

        </div>
        </div>
      </div>
    </div>
  );
}
