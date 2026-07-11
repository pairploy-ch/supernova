import Link from 'next/link';
import { GAMES_LIST } from '@/lib/games';

export default function GamesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
          <span className="gradient-text">Games</span>
        </h1>
        <p style={{ color: 'var(--text-muted)' }} className="text-sm">
          เลือกเกมที่คุณชื่นชอบ
        </p>
      </div>

      <div className="grid gap-6">
        {GAMES_LIST.map((game) => (
          <Link key={game.code} href={`/games/${game.slug}`} className="card block group overflow-hidden">
            <div style={{ height: '200px', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <img
                src={game.bannerImage}
                alt=""
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(90deg, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.3) 80%)`,
              }} />

              <div className="relative z-10 px-8 flex items-center gap-8 w-full">
                <div className="flex-1">
                  <div style={{ color: game.accent, fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {game.subtitle}
                  </div>
                  <h2 className="text-white font-black text-4xl md:text-5xl group-hover:opacity-90 transition-opacity" style={{ textShadow: `0 0 40px ${game.accent}40` }}>
                    {game.name}
                  </h2>
                  <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '400px' }} className="text-sm mt-2">
                    {game.description}
                  </p>
                </div>

                <div className="hidden md:flex flex-col gap-2 text-right">
                  {[
                    { label: 'Players', value: game.players },
                    { label: 'Genre', value: game.genre },
                    { label: 'Platform', value: game.platform },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <div style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
                      <div style={{ color: game.accent, fontWeight: 700, fontSize: '14px' }}>{stat.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{
                  border: `1px solid ${game.accent}60`,
                  borderRadius: '8px', padding: '10px 20px',
                  color: game.accent, fontWeight: 700, fontSize: '13px',
                  backdropFilter: 'blur(4px)', flexShrink: 0,
                }}>
                  เข้าชม →
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
