'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteArticle } from './actions';

export default function DeleteArticleButton({ id }: { id: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      style={{ color: '#e11d48', background: 'none', border: 'none', cursor: pending ? 'default' : 'pointer', opacity: pending ? 0.5 : 1 }}
      onClick={() => {
        if (!confirm('ลบข่าวนี้ใช่หรือไม่?')) return;
        startTransition(async () => {
          await deleteArticle(id);
        });
      }}
    >
      {pending ? <span className="spinner-sm dark" /> : <Trash2 size={15} />}
    </button>
  );
}
