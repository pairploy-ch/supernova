'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import type { ForumReply } from '@/lib/types';
import { formatThaiDate } from '@/lib/formatDate';
import ProfileAvatar from '@/components/profile/ProfileAvatar';
import ReplyForm from './ReplyForm';

function ReplyNode({ reply, threadId, slug, depth }: { reply: ForumReply; threadId: string; slug: string; depth: number }) {
  const [replying, setReplying] = useState(false);

  return (
    <div style={{ marginLeft: depth > 0 ? '32px' : 0 }}>
      <div className="flex gap-3" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '14px', marginTop: '14px' }}>
        <ProfileAvatar avatarUrl={reply.authorAvatarUrl} name={reply.authorName} frame={reply.authorAvatarFrame} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{reply.authorName}</span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatThaiDate(reply.createdAt)}</span>
          </div>
          <p className="text-sm mt-1" style={{ color: 'var(--text-primary)' }}>{reply.body}</p>
          {reply.imageUrl && (
            <img src={reply.imageUrl} alt="" style={{ maxWidth: '280px', borderRadius: 0, marginTop: '8px' }} />
          )}
          <button
            className="text-xs font-semibold mt-2 flex items-center gap-1"
            style={{ color: 'var(--cat-blue)', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setReplying((v) => !v)}
          >
            <MessageSquare size={12} /> ตอบกลับ
          </button>

          {replying && (
            <div className="mt-2">
              <ReplyForm threadId={threadId} slug={slug} parentReplyId={reply.id} onDone={() => setReplying(false)} autoFocus />
            </div>
          )}

          {reply.children.map((child) => (
            <ReplyNode key={child.id} reply={child} threadId={threadId} slug={slug} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ReplyTree({ replies, threadId, slug }: { replies: ForumReply[]; threadId: string; slug: string }) {
  if (replies.length === 0) {
    return (
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
        ยังไม่มีการตอบกลับ เป็นคนแรกที่ร่วมพูดคุย!
      </p>
    );
  }

  return (
    <div>
      {replies.map((reply) => (
        <ReplyNode key={reply.id} reply={reply} threadId={threadId} slug={slug} depth={0} />
      ))}
    </div>
  );
}
