import Link from 'next/link';

export default function AuthTabs({ active }: { active: 'login' | 'register' }) {
  return (
    <div className="flex" style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '32px' }}>
      <Link
        href="/login"
        className="flex-1 text-center"
        style={{
          padding: '0 0 14px',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: active === 'login' ? '#111' : 'var(--text-muted)',
          borderBottom: active === 'login' ? '2px solid var(--accent-pink)' : '2px solid transparent',
          marginBottom: '-1px',
        }}
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="flex-1 text-center"
        style={{
          padding: '0 0 14px',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: active === 'register' ? '#111' : 'var(--text-muted)',
          borderBottom: active === 'register' ? '2px solid var(--accent-pink)' : '2px solid transparent',
          marginBottom: '-1px',
        }}
      >
        Register
      </Link>
    </div>
  );
}
