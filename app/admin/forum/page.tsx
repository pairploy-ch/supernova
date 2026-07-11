import { getAllThreadsForAdmin } from '@/lib/supabase/queries/forum';
import ThreadModerationRow from './ThreadModerationRow';

export default async function AdminForumPage() {
  const threads = await getAllThreadsForAdmin();

  return (
    <div>
      <h1 className="text-xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>จัดการกระทู้</h1>

      <div className="card overflow-hidden">
        {threads.map((thread) => (
          <ThreadModerationRow key={thread.id} thread={thread} />
        ))}
        {threads.length === 0 && (
          <p className="text-sm py-10 text-center" style={{ color: 'var(--text-muted)' }}>ยังไม่มีกระทู้</p>
        )}
      </div>
    </div>
  );
}
