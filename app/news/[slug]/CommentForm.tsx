'use client';

import { useActionState, useRef } from 'react';
import { postComment } from './actions';

export default function CommentForm({ articleId, slug }: { articleId: string; slug: string }) {
  const [state, action, pending] = useActionState(postComment, undefined);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await action(formData);
        formRef.current?.reset();
      }}
      className="space-y-3"
    >
      <input type="hidden" name="articleId" value={articleId} />
      <input type="hidden" name="slug" value={slug} />
      <textarea
        className="form-input"
        name="body"
        rows={3}
        maxLength={2000}
        placeholder="แสดงความคิดเห็น..."
        required
      />
      {state?.error && <p className="form-error">{state.error}</p>}
      <button className="btn-primary text-sm" type="submit" disabled={pending}>
        {pending ? 'กำลังส่ง...' : 'แสดงความคิดเห็น'}
      </button>
    </form>
  );
}
