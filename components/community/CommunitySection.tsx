import Link from 'next/link';
import { Bell, Lock, Flame, ChevronRight } from 'lucide-react';
import { getHotThreads } from '@/lib/supabase/queries/forum';
import { GAMES } from '@/lib/games';
import { formatRelativeCompact, formatCompactNumber } from '@/lib/formatDate';
import { stripMarkdown } from '@/lib/text';
import ProfileAvatar from '@/components/profile/ProfileAvatar';

export default async function CommunitySection() {
  const threads = await getHotThreads(5);

  return (
    <section style={{ background: '#fff', borderTop: '1px solid #eee' }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div
          style={{ background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)', borderRadius: 0 }}
          className="p-6 mb-6 relative overflow-hidden"
        >
          <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '100px', opacity: 0.1 }}>
            👥
          </div>
          <h2 className="text-white font-medium text-2xl">Supernova Community</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm mt-1">
            AOV • Mobile Legends • Valorant
          </p>
        </div>

        {/* Header row */}
        <div className="flex items-center gap-2 mb-2 px-1">
          <h3 style={{ color: '#111' }} className="font-medium text-base flex items-center gap-2">
            <Flame size={16} style={{ color: '#e91e8c' }} />
            กระทู้ฮอต
          </h3>
          <Link
            href="/community"
            style={{ color: '#e91e8c', border: '1px solid #e91e8c', marginLeft: 'auto' }}
            className="text-xs font-bold px-3 py-1 rounded flex items-center gap-1 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            More <ChevronRight size={12} />
          </Link>
        </div>

        {/* Forum rows */}
        <div className="card overflow-hidden">
          <div className="forum-table-head">
            <span>Topic</span>
            <span>Category</span>
            <span>Users</span>
            <span>Replies</span>
            <span>Views</span>
            <span>Activity</span>
          </div>

          {threads.map((thread) => {
            const game = GAMES[thread.gameCode];
            return (
              <Link key={thread.id} href={`/community/${thread.slug}`} className="forum-table-row">
                <div className="forum-table-topic">
                  <h3>
                    {thread.isPinned && <Bell size={13} style={{ color: 'var(--cat-blue)', flexShrink: 0 }} />}
                    {thread.isLocked && <Lock size={12} style={{ flexShrink: 0 }} />}
                    <span className="line-clamp-1">{thread.title}</span>
                  </h3>
                  {thread.body && <p className="line-clamp-1">{stripMarkdown(thread.body)}</p>}
                </div>

                <div className="forum-table-category">
                  <span className="dot" style={{ background: game.accent }} />
                  <span style={{ color: game.accent }}>{game.name}</span>
                </div>

                <div className="forum-table-users">
                  <ProfileAvatar avatarUrl={thread.authorAvatarUrl} name={thread.authorName} frame={thread.authorAvatarFrame} size={28} />
                </div>

                <div className="forum-table-replies num-col">{thread.replyCount}</div>
                <div className="forum-table-views num-col">{formatCompactNumber(thread.viewCount)}</div>
                <div className="forum-table-activity num-col">{formatRelativeCompact(thread.createdAt)}</div>
              </Link>
            );
          })}
          {threads.length === 0 && (
            <p className="text-sm py-8 text-center" style={{ color: '#888' }}>
              ยังไม่มีกระทู้ เป็นคนแรกที่เริ่มพูดคุย!
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
