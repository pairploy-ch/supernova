'use client';

import { useActionState } from 'react';
import { ChevronRight } from 'lucide-react';
import { signIn } from '../actions';

export default function LoginForm() {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="form-label" htmlFor="email">Email</label>
        <input className="form-input-pill" id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <label className="form-label" htmlFor="password">Password</label>
        <input className="form-input-pill" id="password" name="password" type="password" required autoComplete="current-password" />
      </div>
      {state?.error && <p className="form-error">{state.error}</p>}
      <button className="btn-primary w-full justify-center" type="submit" disabled={pending} style={{ background: 'var(--cat-blue)' }}>
        {pending ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
        <ChevronRight size={14} />
      </button>
    </form>
  );
}
