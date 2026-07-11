'use client';

import { useActionState, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
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
    >
      <input type="hidden" name="articleId" value={articleId} />
      <input type="hidden" name="slug" value={slug} />
      <label className="form-label" htmlFor="comment-body">ความคิดเห็นของคุณ</label>
      <textarea
        id="comment-body"
        className="form-input"
        style={{ borderRadius: '16px', padding: '14px 18px' }}
        name="body"
        rows={4}
        maxLength={2000}
        placeholder="เขียนความคิดเห็นที่นี่..."
        required
      />
      {state?.error && <p className="form-error">{state.error}</p>}
      <div className="flex justify-end mt-3">
        <button
          className="text-sm"
          type="submit"
          disabled={pending}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 0,
            background: 'var(--accent-pink)', borderRadius: '999px',
            border: 'none', cursor: 'pointer', overflow: 'hidden', opacity: pending ? 0.7 : 1,
          }}
        >
          <span style={{ color: 'white', fontWeight: 700, fontSize: '13px', letterSpacing: '0.05em', textTransform: 'uppercase', padding: '13px 26px' }}>
            {pending ? 'กำลังส่ง...' : 'ส่งความคิดเห็น'}
          </span>
          <span style={{ background: '#b3166b', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', margin: '3px 3px 3px 0' }}>
            <ChevronRight size={17} color="white" />
          </span>
        </button>
      </div>
    </form>
  );
}
