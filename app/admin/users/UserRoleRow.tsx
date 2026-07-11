'use client';

import { useTransition } from 'react';
import { ShieldCheck, Shield } from 'lucide-react';
import { setUserRole } from './actions';
import type { AdminUserListItem } from '@/lib/supabase/queries/admin';
import { formatThaiDate } from '@/lib/formatDate';

export default function UserRoleRow({ user, isSelf }: { user: AdminUserListItem; isSelf: boolean }) {
  const isAdmin = user.role === 'admin';
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <div
        className="flex-shrink-0"
        style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #e91e8c, #7b2ff7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '12px', fontWeight: 700, color: 'white',
        }}
      >
        {(user.displayName || user.username).charAt(0).toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {user.displayName || user.username}
          {isSelf && <span style={{ color: 'var(--text-muted)' }}> (คุณ)</span>}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          @{user.username} · เข้าร่วมเมื่อ {formatThaiDate(user.createdAt)}
        </p>
      </div>

      <span
        className="pill-tag flex-shrink-0"
        style={{ background: isAdmin ? 'var(--cat-purple)' : 'var(--bg-card)', color: isAdmin ? 'white' : 'var(--text-muted)' }}
      >
        {isAdmin ? 'ADMIN' : 'USER'}
      </span>

      <button
        title={isAdmin ? 'ลดสิทธิ์เป็นผู้ใช้ทั่วไป' : 'แต่งตั้งเป็นแอดมิน'}
        disabled={(isSelf && isAdmin) || pending}
        onClick={() => {
          if (isAdmin && !window.confirm(`ลดสิทธิ์ ${user.username} จาก admin เป็น user?`)) return;
          startTransition(async () => {
            await setUserRole(user.id, isAdmin ? 'user' : 'admin');
          });
        }}
        style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'none', border: '1px solid var(--border-color)', borderRadius: '999px',
          padding: '6px 14px', fontSize: '12px', fontWeight: 600,
          color: isAdmin ? '#e11d48' : 'var(--cat-purple)',
          cursor: (isSelf && isAdmin) || pending ? 'not-allowed' : 'pointer',
          opacity: (isSelf && isAdmin) || pending ? 0.4 : 1,
          flexShrink: 0,
        }}
      >
        {pending ? <span className="spinner-sm dark" /> : isAdmin ? <Shield size={13} /> : <ShieldCheck size={13} />}
        {isAdmin ? 'ลดสิทธิ์' : 'แต่งตั้งแอดมิน'}
      </button>
    </div>
  );
}
