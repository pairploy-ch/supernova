import Link from 'next/link';
import { getAllGamesFull } from '@/lib/supabase/queries/games';

export default async function AdminGamesPage() {
  const games = await getAllGamesFull();

  return (
    <div>
      <h1 className="text-xl font-medium mb-6" style={{ color: 'var(--text-primary)' }}>จัดการเกมส์</h1>

      <div className="grid gap-4">
        {games.map((game) => (
          <Link key={game.code} href={`/admin/games/${game.code}/edit`} className="card p-4 flex items-center gap-4">
            <div style={{ width: '64px', height: '64px', borderRadius: 0, overflow: 'hidden', flexShrink: 0, background: 'var(--bg-card)' }}>
              {game.bannerImage && (
                <img src={game.bannerImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {game.name} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({game.code.toUpperCase()})</span>
              </p>
              <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                {game.tagline || 'ยังไม่มีข้อมูล — กดเพื่อกรอก'}
              </p>
            </div>
            <span className="text-xs font-bold flex-shrink-0" style={{ color: game.accent }}>แก้ไข →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
