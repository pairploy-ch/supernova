import { getAdminCounts } from '@/lib/supabase/queries/admin';

export default async function AdminDashboardPage() {
  const counts = await getAdminCounts();

  const stats = [
    { label: 'ข่าวทั้งหมด', value: counts.totalArticles },
    { label: 'เผยแพร่แล้ว', value: counts.publishedArticles },
    { label: 'กระทู้ทั้งหมด', value: counts.totalThreads },
    { label: 'ความคิดเห็น', value: counts.totalComments },
    { label: 'ผู้ใช้ทั้งหมด', value: counts.totalUsers },
  ];

  return (
    <div>
      <h1 className="text-xl font-medium mb-6" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <p className="text-2xl font-black gradient-text">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
