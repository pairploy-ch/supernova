interface AdBannerProps {
  width?: number;
  height?: number;
  imageUrl?: string;
  href?: string;
}

export default function AdBanner({ width = 250, height = 250, imageUrl, href }: AdBannerProps) {
  const box = (
    <div
      style={{
        width: '100%',
        aspectRatio: `${width} / ${height}`,
        maxWidth: `${width}px`,
        margin: '0 auto',
        position: 'relative',
        overflow: 'hidden',
        background: imageUrl ? undefined : 'linear-gradient(135deg, #0a3d91, #1c5fc4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="Advertisement" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div style={{ fontWeight: 900, fontSize: '20px', letterSpacing: '0.05em' }}>BANNER</div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>{width}x{height}</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="card p-3">
      <p
        style={{
          fontSize: '9px', letterSpacing: '0.08em', textTransform: 'uppercase',
          color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center',
        }}
      >
        Advertisement
      </p>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer sponsored">
          {box}
        </a>
      ) : (
        box
      )}
    </div>
  );
}
