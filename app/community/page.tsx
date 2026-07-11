import Link from 'next/link';
import { MessageSquare, ThumbsUp, Flame, PlusCircle } from 'lucide-react';
import { getThreads, getHotThreads } from '@/lib/supabase/queries/forum';
import { GAMES_LIST, GAMES, type GameCode } from '@/lib/games';

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
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div style={{ borderBottom: '1px solid var(--border-color)' }} className="flex overflow-x-auto flex-1 min-w-0">
            <Link href={buildHref()} className={`community-tab ${!gameCode ? 'active' : ''}`}>
              ทั้งหมด
            </Link>
            {GAMES_LIST.map((g) => (
              <Link key={g.code} href={buildHref(g.code)} className={`community-tab ${gameCode === g.code ? 'active' : ''}`}>
                {g.name}
              </Link>
            ))}
          </div>

          <Link href="/community/new" className="btn-primary flex-shrink-0" style={{ background: 'var(--cat-blue)' }}>
            <PlusCircle size={16} />
            สร้างกระทู้ใหม่
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main */}
          <div className="lg:col-span-3">
          {/* Threads */}
          <div className="card overflow-hidden">
            <div style={{ background: 'var(--bg-nav)', borderBottom: '1px solid var(--border-color)' }} className="flex items-center gap-3 px-4 py-3">
              <div className="flex-1 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>หัวข้อ</div>
              <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                <span>ผู้เขียน</span>
                <span>ยอดชม</span>
                <span>ตอบ</span>
              </div>
            </div>

            {threads.map((thread) => (
              <Link key={thread.id} href={`/community/${thread.slug}`} className="forum-row px-4">
                {thread.isPinned && <Flame size={14} style={{ color: 'var(--accent-pink)', flexShrink: 0 }} />}
                <div
                  style={{
                    background: 'var(--bg-dark)', padding: '2px 8px', borderRadius: '4px',
                    fontSize: '10px', fontWeight: 700, color: GAMES[thread.gameCode].accent,
                    flexShrink: 0, border: `1px solid ${GAMES[thread.gameCode].accent}40`,
                  }}
                >
                  {thread.gameCode.toUpperCase()}
                </div>
                {thread.isPinned && <span className="pill-tag hot">Hot!</span>}
                <div className="flex-1 min-w-0">
                  <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium line-clamp-1 hover:opacity-70 transition-opacity">
                    {thread.isLocked && '🔒 '}
                    {thread.title}
                  </p>
                  <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">{thread.authorName}</p>
                </div>
                <div className="hidden md:flex items-center gap-6 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <div className="avatar-sm" style={{ width: '22px', height: '22px', fontSize: '9px' }}>
                      {thread.authorName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ color: 'var(--text-muted)' }} className="text-xs">{thread.authorName}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)' }} className="flex items-center gap-1 text-xs w-16 justify-end">
                    <ThumbsUp size={11} /> {thread.viewCount.toLocaleString()}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }} className="flex items-center gap-1 text-xs w-10 justify-end">
                    <MessageSquare size={11} /> {thread.replyCount}
                  </div>
                </div>
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
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
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
                    <ThumbsUp size={9} /> {t.viewCount}
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

          <div className="card p-4">
            <h3 className="font-bold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>เกมที่นิยม</h3>
            {GAMES_LIST.map((g) => (
              <Link
                key={g.code}
                href={buildHref(g.code)}
                style={{ borderBottom: '1px solid var(--border-color)', padding: '8px 0' }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: g.accent }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{g.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
