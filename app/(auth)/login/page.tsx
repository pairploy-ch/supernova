import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/dal';
import AuthTabs from '@/components/auth/AuthTabs';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) redirect('/');

  return (
    <div>
      <div className="page-hero">
        <h1>Sign In</h1>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / Login
        </p>
      </div>

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="card p-8">
          <AuthTabs active="login" />

          <div className="section-title-wrap pink" style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#111', fontWeight: 500, fontSize: '18px', letterSpacing: '0.02em', textTransform: 'uppercase', margin: 0 }}>
              Login to Your Account
            </h2>
          </div>

          <LoginForm />

          <p className="text-sm mt-6 text-center" style={{ color: 'var(--text-muted)', textTransform: 'none' }}>
            ยังไม่มีบัญชี?{' '}
            <Link href="/signup" style={{ color: 'var(--accent-pink)', fontWeight: 600 }}>
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
