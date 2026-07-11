import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/dal';
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
          <h2 style={{ display: 'inline-block', fontSize: '18px', paddingBottom: '10px', borderBottom: '3px solid var(--cat-blue)', marginBottom: '24px' }}>
            Join Supernova
          </h2>

          <SignupForm />

          <p className="text-sm mt-6 text-center" style={{ color: 'var(--text-muted)', textTransform: 'none' }}>
            มีบัญชีอยู่แล้ว?{' '}
            <Link href="/login" style={{ color: 'var(--cat-blue)', fontWeight: 600 }}>
              เข้าสู่ระบบ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
