import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, MessageSquare, Eye } from 'lucide-react';
import { getGameFullBySlug } from '@/lib/supabase/queries/games';
import { getLatestArticles } from '@/lib/supabase/queries/articles';
import { getThreads } from '@/lib/supabase/queries/forum';
import { ARTICLE_CATEGORY_META } from '@/lib/articleCategory';
import { formatThaiDate } from '@/lib/formatDate';
import NewsCard from '@/components/news/NewsCard';

const SECTION_NAV = [
  { href: '#heroes', label: 'Heroes' },
  { href: '#maps', label: 'Maps' },
  { href: '#lore', label: 'Lore' },
  { href: '#news', label: 'News' },
  { href: '#community', label: 'Community' },
];

export default async function GameHubPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const game = await getGameFullBySlug(slug);
  if (!game) notFound();

  const [news, { threads }] = await Promise.all([
    getLatestArticles(4, { gameCode: game.code }),
    getThreads({ gameCode: game.code, page: 1 }),
  ]);

  return (
    <div>
      {/* Cinematic hero */}
      <div style={{ height: '440px', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img
          src={game.bannerImage}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.9) 100%)' }} />

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10 text-center">
          <div style={{ color: game.accent, fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '10px' }}>
            {game.subtitle}
          </div>
          <h1 className="text-white font-medium" style={{ fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: 1.1, textShadow: `0 0 50px ${game.accent}60` }}>
            {game.tagline}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm mt-4 max-w-xl mx-auto">
            {game.description}
          </p>

          <div className="flex justify-center gap-10 mt-8">
            {[
              { label: 'Players', value: game.players },
              { label: 'Genre', value: game.genre },
              { label: 'Platform', value: game.platform },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em' }}>{stat.label}</div>
                <div style={{ color: game.accent, fontWeight: 700, fontSize: '15px' }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section sub-nav */}
      <div style={{ background: '#111', borderBottom: `2px solid ${game.accent}` }}>
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8 overflow-x-auto">
          {SECTION_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-bold uppercase whitespace-nowrap"
              style={{ color: 'rgba(255,255,255,0.75)', padding: '14px 4px', letterSpacing: '0.08em' }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-14">
        {/* Heroes */}
        <section id="heroes" className="scroll-mt-16">
          <h2 className="section-title mb-6" style={{ '--section-accent': game.accent } as React.CSSProperties}>Meet the Heroes</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {game.characters.map((hero) => (
              <div
                key={hero.name}
                className="flex-shrink-0"
                style={{ width: '220px', borderRadius: 0, overflow: 'hidden', position: 'relative', height: '300px' }}
              >
                <img src={hero.image} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 20%, transparent 60%)' }} />
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                  <div style={{ color: game.accent, fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {hero.role}
                  </div>
                  <h3 className="text-white font-medium text-lg leading-tight">{hero.name}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11px', marginTop: '4px' }}>&ldquo;{hero.quote}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Maps */}
        <section id="maps" className="scroll-mt-16">
          <h2 className="section-title mb-6" style={{ '--section-accent': game.accent } as React.CSSProperties}>Maps</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {game.maps.map((map) => (
              <div key={map.name} className="card overflow-hidden">
                <div style={{ height: '140px', position: 'relative' }}>
                  <img src={map.image} alt={map.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{map.name}</h3>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{map.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Lore */}
        <section id="lore" className="scroll-mt-16">
          <h2 className="section-title mb-6" style={{ '--section-accent': game.accent } as React.CSSProperties}>Lore</h2>
          <div className="card p-8" style={{ position: 'relative', overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute', inset: 0, backgroundImage: `url(${game.bannerImage})`,
                backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.08,
              }}
            />
            <p className="relative text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{game.lore}</p>
          </div>
        </section>

        {/* Latest news */}
        <section id="news" className="scroll-mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0" style={{ '--section-accent': game.accent } as React.CSSProperties}>ข่าวล่าสุด</h2>
            <Link href={`/news?category=${game.code}`} style={{ color: game.accent, border: `1px solid ${game.accent}` }} className="text-xs font-bold px-3 py-1 rounded flex items-center gap-1 hover:opacity-80 transition-opacity flex-shrink-0">
              ดูทั้งหมด <ChevronRight size={12} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
            {news.map((article) => (
              <NewsCard
                key={article.id}
                slug={article.slug}
                tag={ARTICLE_CATEGORY_META[article.category].label}
                tagClass={ARTICLE_CATEGORY_META[article.category].tagClass}
                title={article.title}
                excerpt={article.excerpt}
                author={article.authorName}
                date={formatThaiDate(article.publishedAt)}
                imageUrl={article.coverImageUrl}
              />
            ))}
            {news.length === 0 && (
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>ยังไม่มีข่าวสำหรับเกมนี้</p>
            )}
          </div>
        </section>

        {/* Community threads */}
        <section id="community" className="scroll-mt-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="section-title mb-0" style={{ '--section-accent': game.accent } as React.CSSProperties}>กระทู้ล่าสุด</h2>
            <Link href={`/community?game=${game.code}`} style={{ color: game.accent, border: `1px solid ${game.accent}` }} className="text-xs font-bold px-3 py-1 rounded flex items-center gap-1 hover:opacity-80 transition-opacity flex-shrink-0">
              ดูทั้งหมด <ChevronRight size={12} />
            </Link>
          </div>
          <div className="card overflow-hidden">
            {threads.map((thread) => (
              <Link key={thread.id} href={`/community/${thread.slug}`} className="forum-row px-4">
                <div className="flex-1 min-w-0">
                  <p style={{ color: 'var(--text-primary)' }} className="text-sm font-medium line-clamp-1">{thread.title}</p>
                  <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-0.5">{thread.authorName}</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div style={{ color: 'var(--text-muted)' }} className="flex items-center gap-1 text-xs">
                    <Eye size={11} /> {thread.viewCount}
                  </div>
                  <div style={{ color: 'var(--text-muted)' }} className="flex items-center gap-1 text-xs">
                    <MessageSquare size={11} /> {thread.replyCount}
                  </div>
                </div>
              </Link>
            ))}
            {threads.length === 0 && (
              <p className="text-sm py-8 text-center" style={{ color: 'var(--text-muted)' }}>ยังไม่มีกระทู้สำหรับเกมนี้</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
