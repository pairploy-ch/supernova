import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/dal';
import AuthTabs from '@/components/auth/AuthTabs';
import SignupForm from './SignupForm';

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect('/');

  return (
    <div>
      <div className="page-hero">
        <h1>Create Account</h1>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / Sign Up
        </p>
      </div>

      <div className="max-w-md mx-auto px-4 py-16">
        <div className="card p-8">
          <AuthTabs active="register" />

          <div className="section-title-wrap pink" style={{ marginBottom: '24px' }}>
            <h2 style={{ color: '#111', fontWeight: 500, fontSize: '18px', letterSpacing: '0.02em', textTransform: 'uppercase', margin: 0 }}>
              Create Your Account
            </h2>
          </div>

          <SignupForm />

          <p className="text-sm mt-6 text-center" style={{ color: 'var(--text-muted)', textTransform: 'none' }}>
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" style={{ color: 'var(--accent-pink)', fontWeight: 600 }}>
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
