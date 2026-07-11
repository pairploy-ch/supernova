import { requireAdmin } from '@/lib/dal';
import AdminSidebar from './AdminSidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
        <AdminSidebar />
        <div>{children}</div>
      </div>
    </div>
  );
}
