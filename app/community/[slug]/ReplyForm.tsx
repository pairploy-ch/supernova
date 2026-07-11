'use client';

import { useActionState, useRef } from 'react';
import { postReply } from './actions';

export default function ReplyForm({
  threadId,
  slug,
  parentReplyId = null,
  onDone,
  autoFocus = false,
}: {
  threadId: string;
  slug: string;
  parentReplyId?: string | null;
  onDone?: () => void;
  autoFocus?: boolean;
}) {
  const [state, action, pending] = useActionState(postReply, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
        onDone?.();
      }}
      className="space-y-2"
    >
      <input type="hidden" name="threadId" value={threadId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="parentReplyId" value={parentReplyId ?? ''} />
      <textarea
        className="form-input"
        name="body"
        rows={parentReplyId ? 2 : 3}
        maxLength={5000}
        placeholder={parentReplyId ? 'ตอบกลับ...' : 'แสดงความคิดเห็นในกระทู้นี้...'}
        required
        autoFocus={autoFocus}
      />
      {!parentReplyId && (
        <input className="text-xs" name="image" type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
      )}
      {state?.error && <p className="form-error">{state.error}</p>}
      <div className="flex gap-2">
        <button className="btn-primary text-sm" type="submit" disabled={pending}>
          {pending ? 'กำลังส่ง...' : 'ตอบกลับ'}
        </button>
        {parentReplyId && onDone && (
          <button type="button" className="btn-secondary text-sm" onClick={onDone}>
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}
