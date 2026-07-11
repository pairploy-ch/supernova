'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg, #0d0230 0%, #1a0533 40%, #2d0a4e 70%, #0a0a2a 100%)',
  'linear-gradient(135deg, #1a0505 0%, #3d0a0a 40%, #2d0510 70%, #0a0a1a 100%)',
  'linear-gradient(135deg, #001a33 0%, #002d5c 40%, #001a4d 70%, #000d1a 100%)',
];

export interface HeroSlide {
  slug: string;
  badge: string;
  badgeColor: string;
  title: string;
  desc: string | null;
  bg: string | null;
}

export default function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <div
        style={{
          position: 'relative', width: '100%', height: '420px',
          background: FALLBACK_GRADIENTS[0], display: 'flex', alignItems: 'center',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 40px', width: '100%' }}>
          <h1 style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 900 }}>
            ยินดีต้อนรับสู่ Supernova
          </h1>
        </div>
      </div>
    );
  }

  const slide = slides[current];

  return (
    <div style={{ position: 'relative', width: '100%', height: '420px', overflow: 'hidden' }}>
      {/* Background layers */}
      {slides.map((s, i) => (
        <div
          key={s.slug}
          style={{ position: 'absolute', inset: 0, opacity: i === current ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: 0 }}
        >
          <div style={{ position: 'absolute', inset: 0, background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }} />
          {s.bg && (
            <img
              src={s.bg}
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.15) 100%)' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)' }} />
        </div>
      ))}

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1280px', margin: '0 auto', padding: '0 40px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: '520px' }}>
          <div
            key={`badge-${current}`}
            style={{
              display: 'inline-block', background: slide.badgeColor, color: 'white',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '4px 12px', borderRadius: '4px', marginBottom: '16px',
              animation: 'fadeSlideUp 0.5s ease both',
            }}
          >
            {slide.badge}
          </div>

          <h1
            key={`title-${current}`}
            style={{ color: 'white', fontSize: 'clamp(24px, 4vw, 42px)', fontWeight: 900, lineHeight: 1.15, marginBottom: '16px', animation: 'fadeSlideUp 0.55s 0.05s ease both' }}
          >
            {slide.title}
          </h1>

          {slide.desc && (
            <p
              key={`desc-${current}`}
              style={{ color: 'rgba(255,255,255,0.72)', fontSize: '14px', lineHeight: 1.7, marginBottom: '32px', animation: 'fadeSlideUp 0.6s 0.1s ease both' }}
            >
              {slide.desc}
            </p>
          )}

          <div key={`btn-${current}`} style={{ animation: 'fadeSlideUp 0.65s 0.15s ease both' }}>
            <Link
              href={`/news/${slide.slug}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 0,
                background: 'linear-gradient(90deg, #e91e8c, #f06292)', borderRadius: '999px',
                textDecoration: 'none', overflow: 'hidden',
              }}
            >
              <span style={{ color: 'white', fontWeight: 700, fontSize: '14px', padding: '11px 24px' }}>Read More</span>
              <span style={{ background: 'rgba(255,255,255,0.2)', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', margin: '2px 2px 2px 0' }}>
                <ChevronRight size={16} color="white" />
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px', zIndex: 20 }}>
        {slides.map((s, i) => (
          <button
            key={s.slug}
            onClick={() => setCurrent(i)}
            className={`dot-indicator ${i === current ? 'active' : ''}`}
            style={{ width: i === current ? '28px' : '10px', border: 'none', padding: 0 }}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
