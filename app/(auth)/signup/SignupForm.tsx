'use client';

import { useActionState } from 'react';
import { ChevronRight } from 'lucide-react';
import { signUp } from '../actions';

export default function SignupForm() {
  const [state, action, pending] = useActionState(signUp, undefined);

  if (state?.message) {
    return <p style={{ color: 'var(--text-primary)', textTransform: 'none' }}>{state.message}</p>;
  }

  return (
    <form action={action} className="space-y-5">
      <div>
        <label className="form-label" htmlFor="username">Username</label>
        <input className="form-input-pill" id="username" name="username" type="text" required autoComplete="username" minLength={3} maxLength={24} />
      </div>
      <div>
        <label className="form-label" htmlFor="email">Email</label>
        <input className="form-input-pill" id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <label className="form-label" htmlFor="password">Password</label>
        <input className="form-input-pill" id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
      </div>
      {state?.error && <p className="form-error">{state.error}</p>}
      <button className="btn-primary w-full justify-center" type="submit" disabled={pending} style={{ background: 'var(--cat-blue)' }}>
        {pending ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
        <ChevronRight size={14} />
      </button>
    </form>
  );
}
