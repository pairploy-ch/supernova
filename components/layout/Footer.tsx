"use client";
import Link from 'next/link';
import { GAMES_LIST } from '@/lib/games';
import { SOCIAL_LINKS } from '@/components/icons/SocialIcons';

export default function Footer() {
  return (
    <footer style={{ background: '#000000' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1.4fr', gap: '40px' }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src="/logo-icon.png" alt="Supernova" style={{ width: '40px', height: '52px', objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <div style={{ color: '#e91e8c', fontWeight: 900, fontSize: '18px', letterSpacing: '0.06em', lineHeight: 1 }}>
                  SUPERNOVA
                </div>
                <div style={{ color: '#aaa', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1.4 }}>
                  Gaming Community
                </div>
              </div>
            </div>
            <p style={{ color: '#aaa', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus
            </p>
          </div>

          {/* Games */}
          <div>
            <div className="section-title-wrap pink on-dark" style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#fff', fontWeight: 500, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                GAMES
              </h4>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {GAMES_LIST.map((g) => (
                <li key={g.code}>
                  <Link href={`/games/${g.slug}`} style={{ color: '#aaa', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
                  >
                    {g.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <div className="section-title-wrap pink on-dark" style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#fff', fontWeight: 500, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                QUICK LINK
              </h4>
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[{ label: 'Games', href: '/games' }, { label: 'News', href: '/news' }, { label: 'Events', href: '/events' }, { label: 'Community', href: '/community' }].map((g) => (
                <li key={g.href}>
                  <Link href={g.href} style={{ color: '#aaa', fontSize: '13px', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#aaa')}
                  >
                    {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="section-title-wrap pink on-dark" style={{ marginBottom: '16px' }}>
              <h4 style={{ color: '#fff', fontWeight: 500, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                CONTACT
              </h4>
            </div>

            {/* Email input */}
            <div style={{
              display: 'flex', alignItems: 'center',
              background: '#fff', borderRadius: '999px',
              overflow: 'hidden', marginBottom: '16px',
              padding: '2px 2px 2px 16px',
            }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  background: 'transparent', border: 'none', outline: 'none',
                  fontSize: '13px', color: '#333', flex: 1,
                  padding: '8px 0',
                }}
              />
              <button style={{
                background: 'linear-gradient(135deg, #e91e8c, #c0174f)',
                border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: '16px', color: 'white',
              }}>
                →
              </button>
            </div>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {SOCIAL_LINKS.map((s) => (
                <button
                  key={s.name}
                  title={s.name}
                  style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: s.bg, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    transition: 'transform 0.2s, opacity 0.2s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.1)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <s.Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid #444', marginTop: '36px', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>All Rights Reserved 2026</p>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <Link href="#" style={{ color: '#888', fontSize: '12px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >
              Terms and Conditions
            </Link>
            <span style={{ color: '#555' }}>|</span>
            <Link href="#" style={{ color: '#888', fontSize: '12px', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = '#888')}
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
