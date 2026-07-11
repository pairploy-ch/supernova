import { Star } from 'lucide-react';
import { getLatestArticles } from '@/lib/supabase/queries/articles';

export default async function TickerBanner() {
  const articles = await getLatestArticles(5);
  const items = articles.length > 0
    ? articles.map((a) => ({ title: a.title, excerpt: a.excerpt }))
    : [{ title: 'ยินดีต้อนรับสู่ Supernova Gaming Community', excerpt: null }];

  return (
    <div className="ticker-wrap">
      <div className="ticker-badge">
        <Star size={12} fill="white" stroke="white" />
        Live News
      </div>
      <div className="ticker-viewport">
        <div className="ticker-text">
          {[...items, ...items].map((item, i) => (
            <span key={i}>
              <strong>{item.title}</strong>
              {item.excerpt && <>: {item.excerpt}</>}
              <span className="ticker-divider">{'//'}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="ticker-cap-right" />
    </div>
  );
}
