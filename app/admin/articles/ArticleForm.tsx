'use client';

import { useActionState, useState } from 'react';
import { ARTICLE_CATEGORIES, ARTICLE_CATEGORY_META } from '@/lib/articleCategory';
import type { ArticleFormState } from './actions';

export default function ArticleForm({
  action,
  initial,
}: {
  action: (state: ArticleFormState, formData: FormData) => Promise<ArticleFormState>;
  initial?: {
    id: string;
    title: string;
    excerpt: string | null;
    body: string;
    category: string;
    status: string;
    coverImageUrl: string | null;
  };
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [preview, setPreview] = useState<string | null>(initial?.coverImageUrl ?? null);

  return (
    <form action={formAction} className="space-y-4">
      {initial && <input type="hidden" name="id" value={initial.id} />}

      <div>
        <label className="form-label" htmlFor="title">หัวข้อ</label>
        <input className="form-input" id="title" name="title" type="text" required defaultValue={initial?.title} maxLength={200} />
      </div>

      <div>
        <label className="form-label" htmlFor="excerpt">สรุปย่อ</label>
        <input className="form-input" id="excerpt" name="excerpt" type="text" defaultValue={initial?.excerpt ?? ''} maxLength={300} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="form-label" htmlFor="category">หมวดหมู่</label>
          <select className="form-input" id="category" name="category" defaultValue={initial?.category ?? ARTICLE_CATEGORIES[0]}>
            {ARTICLE_CATEGORIES.map((c) => (
              <option key={c} value={c}>{ARTICLE_CATEGORY_META[c].filterLabel}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label" htmlFor="status">สถานะ</label>
          <select className="form-input" id="status" name="status" defaultValue={initial?.status ?? 'draft'}>
            <option value="draft">ร่าง</option>
            <option value="published">เผยแพร่</option>
          </select>
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="body">เนื้อหา (Markdown)</label>
        <textarea className="form-input" id="body" name="body" required rows={14} defaultValue={initial?.body} />
      </div>

      <div>
        <label className="form-label" htmlFor="cover">รูปปก</label>
        {preview && <img src={preview} alt="" style={{ width: '200px', borderRadius: '8px', marginBottom: '8px' }} />}
        <input
          className="text-sm"
          id="cover"
          name="cover"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
        />
      </div>

      {state?.error && <p className="form-error">{state.error}</p>}

      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </form>
  );
}
