import { getAllUsersForAdmin } from '@/lib/supabase/queries/admin';
import { requireAdmin } from '@/lib/dal';
import UserRoleRow from './UserRoleRow';

export default async function AdminUsersPage() {
  const [me, users] = await Promise.all([requireAdmin(), getAllUsersForAdmin()]);

  return (
    <div>
      <h1 className="text-xl font-medium mb-6" style={{ color: 'var(--text-primary)' }}>จัดการผู้ใช้</h1>

      <div className="card overflow-hidden">
        {users.map((user) => (
          <UserRoleRow key={user.id} user={user} isSelf={user.id === me.id} />
        ))}
        {users.length === 0 && (
          <p className="text-sm py-10 text-center" style={{ color: 'var(--text-muted)' }}>ยังไม่มีผู้ใช้</p>
        )}
      </div>
    </div>
  );
}
