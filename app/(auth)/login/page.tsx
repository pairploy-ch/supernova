import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/dal';
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
          <h2 style={{ display: 'inline-block', fontSize: '18px', paddingBottom: '10px', borderBottom: '3px solid var(--cat-blue)', marginBottom: '24px' }}>
            Welcome Back
          </h2>

          <LoginForm />

          <p className="text-sm mt-6 text-center" style={{ color: 'var(--text-muted)', textTransform: 'none' }}>
            ยังไม่มีบัญชี?{' '}
            <Link href="/signup" style={{ color: 'var(--cat-blue)', fontWeight: 600 }}>
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
