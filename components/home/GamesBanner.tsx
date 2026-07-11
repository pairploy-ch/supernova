import Link from 'next/link';
import { GAMES_LIST } from '@/lib/games';

export default function GamesBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="section-title">
        Games
        <div style={{ height: '3px', flex: 1, background: 'var(--gradient-hero)', borderRadius: '2px' }} />
      </h2>

      <div className="flex flex-col gap-4">
        {GAMES_LIST.map((game) => (
          <Link
            key={game.code}
            href={`/games/${game.slug}`}
            className="game-banner card block"
            style={{ height: '160px', position: 'relative' }}
          >
            <img
              src={game.bannerImage}
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(90deg, rgba(0,0,0,0.85) 20%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.15) 100%)`,
            }} />

            <div style={{ position: 'absolute', bottom: '20px', left: '24px' }}>
              <div style={{ color: game.accent, fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '2px' }}>
                {game.subtitle}
              </div>
              <h3 className="text-white font-black text-3xl md:text-4xl" style={{ textShadow: `0 0 30px ${game.accent}50` }}>
                {game.name}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', marginTop: '4px' }}>
                {game.description}
              </p>
            </div>

            <div style={{
              position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)',
              border: `1px solid ${game.accent}60`,
              borderRadius: '6px', padding: '6px 12px',
              color: game.accent, fontSize: '11px', fontWeight: 700,
              backdropFilter: 'blur(4px)', background: 'rgba(0,0,0,0.3)',
            }}>
              PLAY NOW →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
