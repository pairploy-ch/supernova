'use client';

import { Trash2 } from 'lucide-react';
import { deleteArticle } from './actions';

export default function DeleteArticleButton({ id }: { id: string }) {
  return (
    <button
      type="button"
      style={{ color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer' }}
      onClick={(e) => {
        if (!confirm('ลบข่าวนี้ใช่หรือไม่?')) {
          e.preventDefault();
          return;
        }
        deleteArticle(id);
      }}
    >
      <Trash2 size={15} />
    </button>
  );
}
