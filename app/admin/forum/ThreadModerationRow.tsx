'use client';

import { Pin, Lock, Unlock, Trash2, RotateCcw } from 'lucide-react';
import { togglePin, toggleLock, toggleDelete } from './actions';
import type { AdminThreadListItem } from '@/lib/supabase/queries/forum';

export default function ThreadModerationRow({ thread }: { thread: AdminThreadListItem }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)', opacity: thread.isDeleted ? 0.5 : 1 }}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {thread.title}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {thread.gameCode.toUpperCase()} · {thread.authorName} · {thread.replyCount} ตอบกลับ
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          title="ปักหมุด"
          onClick={() => togglePin(thread.id, thread.isPinned)}
          style={{ color: thread.isPinned ? 'var(--accent-pink)' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <Pin size={15} />
        </button>
        <button
          title={thread.isLocked ? 'ปลดล็อก' : 'ล็อก'}
          onClick={() => toggleLock(thread.id, thread.isLocked)}
          style={{ color: thread.isLocked ? '#f59e0b' : 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {thread.isLocked ? <Unlock size={15} /> : <Lock size={15} />}
        </button>
        <button
          title={thread.isDeleted ? 'กู้คืน' : 'ลบ'}
          onClick={() => toggleDelete(thread.id, thread.isDeleted)}
          style={{ color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {thread.isDeleted ? <RotateCcw size={15} /> : <Trash2 size={15} />}
        </button>
      </div>
    </div>
  );
}
