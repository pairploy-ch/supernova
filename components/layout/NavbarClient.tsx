'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { Search, ChevronDown, Menu, X, User, Settings, Shield, LogOut } from 'lucide-react';
import { GAMES_LIST } from '@/lib/games';
import { signOut } from '@/app/(auth)/actions';

function LogoutButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        background: 'var(--accent-pink)',
        color: 'white', fontSize: '11px', fontWeight: 700,
        padding: '5px 8px 5px 14px', borderRadius: '999px',
        border: 'none', cursor: pending ? 'default' : 'pointer', letterSpacing: '0.05em',
        display: 'flex', alignItems: 'center', gap: '6px',
        opacity: pending ? 0.7 : 1,
      }}
    >
      LOGOUT
      <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {pending ? <span className="spinner-sm" /> : <LogOut size={9} />}
      </span>
    </button>
  );
}

interface NavbarUser {
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
}

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavbarClient({ user }: { user: NavbarUser | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header>
      {/* ── Top Bar ── */}
      <div style={{ background: 'var(--header-dark)' }}>
        <div className="max-w-7xl mx-auto px-6 h-9 flex items-center justify-end gap-4">
          {user ? (
            <>
              <div
                className="relative"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0',
                  }}
                >
                  <div
                    style={{
                      width: '20px', height: '20px', borderRadius: '50%',
                      background: user.avatarUrl ? `url(${user.avatarUrl}) center/cover` : 'linear-gradient(135deg, #e91e8c, #7b2ff7)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '9px', fontWeight: 700, color: 'white', flexShrink: 0,
                    }}
                  >
                    {!user.avatarUrl && (user.displayName || user.username).charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: '#ddd', fontSize: '12px', fontWeight: 500 }}>
                    {user.displayName || user.username}
                  </span>
                  <ChevronDown size={12} style={{ color: '#888' }} />
                </button>

                {accountOpen && (
                  <div
                    style={{
                      position: 'absolute', top: '100%', right: 0,
                      background: '#fff', borderRadius: '8px',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                      minWidth: '180px', zIndex: 100, padding: '6px 0',
                    }}
                  >
                    {[
                      { href: `/profile/${user.username}`, label: 'โปรไฟล์ของฉัน', icon: User },
                      { href: '/profile/edit', label: 'แก้ไขโปรไฟล์', icon: Settings },
                      ...(user.role === 'admin' ? [{ href: '/admin', label: 'Admin Panel', icon: Shield }] : []),
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '9px 16px', color: '#333', fontSize: '13px',
                          fontWeight: 600, textDecoration: 'none',
                        }}
                      >
                        <item.icon size={14} />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <form action={signOut}>
                <LogoutButton />
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                style={{ color: '#ccc', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/signup"
                style={{
                  background: 'var(--accent-pink)',
                  color: 'white', fontSize: '11px', fontWeight: 700,
                  padding: '5px 14px', borderRadius: '999px',
                  textDecoration: 'none', letterSpacing: '0.05em',
                }}
              >
                สมัครสมาชิก
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── Main Nav ── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e8e8e8' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0" style={{ textDecoration: 'none' }}>
            <img src="/logo-icon.png" alt="Supernova" width={34} height={45} style={{ objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 900, fontSize: '17px', letterSpacing: '0.01em', lineHeight: 1 }}>
                <span style={{ color: '#1a1a1a' }}>SUPER</span>
                <span style={{ color: 'var(--accent-pink)' }}>NOVA</span>
              </div>
              <div style={{ color: '#999', fontSize: '9px', letterSpacing: '0.08em', lineHeight: 1.4 }}>
                The Latest Gaming News
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            <Link
              href="/"
              style={{
                color: isActivePath(pathname, '/') ? 'var(--accent-pink)' : '#222',
                fontSize: '14px', fontWeight: 600, padding: '8px 14px',
                textDecoration: isActivePath(pathname, '/') ? 'underline' : 'none',
                textUnderlineOffset: '4px',
              }}
            >
              Home
            </Link>

            {/* Games dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setGamesOpen(true)}
              onMouseLeave={() => setGamesOpen(false)}
            >
              <button
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  color: isActivePath(pathname, '/games') ? 'var(--accent-pink)' : '#222',
                  fontSize: '14px', fontWeight: 600,
                  padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer',
                  textDecoration: isActivePath(pathname, '/games') ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                }}
              >
                Games
                <ChevronDown size={13} style={{ marginTop: '1px' }} />
              </button>

              {gamesOpen && (
                <div
                  style={{
                    position: 'absolute', top: '100%', left: 0,
                    background: '#fff', border: '1px solid #eee',
                    borderRadius: '8px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    minWidth: '160px', zIndex: 100, padding: '6px 0',
                  }}
                >
                  {GAMES_LIST.map((g) => (
                    <Link
                      key={g.code}
                      href={`/games/${g.slug}`}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 16px', color: '#333', fontSize: '13px',
                        fontWeight: 600, textDecoration: 'none',
                      }}
                    >
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.accent, flexShrink: 0 }} />
                      {g.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {[{ label: 'News', href: '/news' }, { label: 'Events', href: '/events' }, { label: 'Community', href: '/community' }].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  color: isActivePath(pathname, item.href) ? 'var(--accent-pink)' : '#222',
                  fontSize: '14px', fontWeight: 600,
                  padding: '8px 14px',
                  textDecoration: isActivePath(pathname, item.href) ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Search icon */}
          <button
            className="hidden md:flex flex-shrink-0"
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#f4f4f4', border: 'none', cursor: 'pointer',
              alignItems: 'center', justifyContent: 'center',
            }}
            aria-label="ค้นหา"
          >
            <Search size={15} color="#555" />
          </button>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-auto"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#333' }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: '#fff', borderTop: '1px solid #eee', padding: '12px 24px 16px' }}>
            {[
              { label: 'Home', href: '/' },
              { label: 'Games', href: '/games' },
              { label: 'News', href: '/news' },
              { label: 'Events', href: '/events' },
              { label: 'Community', href: '/community' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'block',
                  color: isActivePath(pathname, item.href) ? 'var(--accent-pink)' : '#222',
                  fontSize: '14px', fontWeight: 600, padding: '10px 0',
                  textDecoration: isActivePath(pathname, item.href) ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                  borderBottom: '1px solid #f0f0f0',
                }}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {!user && (
              <div className="flex gap-3 mt-3">
                <Link href="/login" className="btn-secondary flex-1 justify-center" onClick={() => setMenuOpen(false)}>เข้าสู่ระบบ</Link>
                <Link href="/signup" className="btn-primary flex-1 justify-center" onClick={() => setMenuOpen(false)}>สมัครสมาชิก</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
