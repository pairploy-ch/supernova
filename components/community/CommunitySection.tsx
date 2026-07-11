import Link from 'next/link';
import { MessageSquare, ThumbsUp, Flame, ChevronRight } from 'lucide-react';
import { getHotThreads } from '@/lib/supabase/queries/forum';
import { GAMES } from '@/lib/games';

export default async function CommunitySection() {
  const threads = await getHotThreads(5);

  return (
    <section style={{ background: '#fff', borderTop: '1px solid #eee' }}>
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Header */}
        <div
          style={{ background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)' }}
          className="rounded-xl p-6 mb-6 relative overflow-hidden"
        >
          <div style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '100px', opacity: 0.1 }}>
            👥
          </div>
          <h2 className="text-white font-black text-2xl">Supernova Community</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm mt-1">
            AOV • Mobile Legends • Valorant
          </p>
        </div>

        {/* Header row */}
        <div className="flex items-center gap-2 mb-2 px-1">
          <h3 style={{ color: '#111' }} className="font-bold text-base flex items-center gap-2">
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
        <div>
          {threads.map((thread) => {
            const game = GAMES[thread.gameCode];
            return (
              <Link key={thread.id} href={`/community/${thread.slug}`} className="forum-row">
                <div style={{ background: '#f5f5f5', border: `1px solid ${game.accent}40`, padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, color: game.accent, flexShrink: 0 }}>
                  {thread.gameCode.toUpperCase()}
                </div>
                <span className="pill-tag hot">Hot!</span>
                <p style={{ color: '#111' }} className="text-sm flex-1 line-clamp-1">
                  {thread.title}
                </p>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div className="avatar-sm">{thread.authorName.charAt(0).toUpperCase()}</div>
                  <span style={{ color: '#888' }} className="text-xs">{thread.authorName}</span>
                </div>
                <div style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }} className="flex-shrink-0">
                  <ThumbsUp size={12} />
                  {thread.viewCount.toLocaleString()}
                </div>
                <div style={{ color: '#888', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }} className="flex-shrink-0">
                  <MessageSquare size={12} />
                  {thread.replyCount}
                </div>
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
