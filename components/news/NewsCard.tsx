import Link from 'next/link';

interface NewsCardProps {
  slug: string;
  tag: string;
  tagClass: string;
  title: string;
  excerpt?: string | null;
  author: string;
  date: string;
  imageUrl?: string | null;
  compact?: boolean;
}

export default function NewsCard({
  slug, tag, tagClass, title, excerpt, author, date, imageUrl, compact = false,
}: NewsCardProps) {
  return (
    <Link
      href={`/news/${slug}`}
      className="news-card-link"
      style={{ background: '#fff', border: '1px solid #eee', borderRadius: 0, overflow: 'hidden', display: 'block', textDecoration: 'none' }}
    >
      <div className="news-card-img" style={{ height: compact ? '140px' : '180px' }}>
        {imageUrl ? (
          <img src={imageUrl} alt={title} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div
            style={{
              background: 'var(--bg-card)',
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <span style={{ color: 'rgba(0,0,0,0.08)', fontSize: '60px' }}>🎮</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <span className={`tag ${tagClass} mb-2 inline-block`}>{tag}</span>
        <h3 style={{ color: '#111' }} className="font-medium text-sm leading-tight mb-1 line-clamp-2">
          {title}
        </h3>
        {!compact && excerpt && (
          <p style={{ color: '#888' }} className="text-xs leading-relaxed line-clamp-2 mb-2">
            {excerpt}
          </p>
        )}
        <p style={{ color: '#aaa' }} className="text-xs">
          by {author} | {date}
        </p>
      </div>
    </Link>
  );
}
