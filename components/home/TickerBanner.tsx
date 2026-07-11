import { getLatestArticles } from '@/lib/supabase/queries/articles';

export default async function TickerBanner() {
  const articles = await getLatestArticles(5);
  const news = articles.length > 0 ? articles.map((a) => a.title) : ['ยินดีต้อนรับสู่ Supernova Gaming Community'];

  return (
    <div className="ticker-wrap flex items-center">
      <div
        style={{ background: 'rgba(0,0,0,0.3)', flexShrink: 0 }}
        className="px-4 py-1 text-white text-xs font-black tracking-widest uppercase mr-4 z-10"
      >
        🔴 LIVE
      </div>
      <div className="overflow-hidden flex-1">
        <div className="ticker-text">
          {[...news, ...news].map((item, i) => (
            <span key={i} className="mr-12">
              📢 {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
