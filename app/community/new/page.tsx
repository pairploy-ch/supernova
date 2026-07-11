import { requireUser } from '@/lib/dal';
import CreateThreadForm from './CreateThreadForm';

export default async function NewThreadPage() {
  await requireUser();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="card p-8">
        <h1 className="text-xl font-black mb-6" style={{ color: 'var(--text-primary)' }}>
          สร้างกระทู้ใหม่
        </h1>
        <CreateThreadForm />
      </div>
    </div>
  );
}
