'use client';

import { useActionState } from 'react';
import { GAMES_LIST } from '@/lib/games';
import { createThread } from './actions';

export default function CreateThreadForm() {
  const [state, action, pending] = useActionState(createThread, undefined);

  return (
    <form action={action} className="space-y-4">
      <div>
        <label className="form-label" htmlFor="gameCode">เกม</label>
        <select className="form-input" id="gameCode" name="gameCode" required defaultValue={GAMES_LIST[0].code}>
          {GAMES_LIST.map((g) => (
            <option key={g.code} value={g.code}>{g.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="form-label" htmlFor="title">หัวข้อ</label>
        <input className="form-input" id="title" name="title" type="text" required maxLength={150} minLength={4} />
      </div>

      <div>
        <label className="form-label" htmlFor="body">เนื้อหา</label>
        <textarea className="form-input" id="body" name="body" required rows={8} maxLength={10000} placeholder="รองรับ Markdown" />
      </div>

      <div>
        <label className="form-label" htmlFor="image">แนบรูปภาพ (ไม่บังคับ)</label>
        <input className="text-sm" id="image" name="image" type="file" accept="image/png,image/jpeg,image/webp,image/gif" />
      </div>

      {state?.error && <p className="form-error">{state.error}</p>}

      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? 'กำลังสร้าง...' : 'ตั้งกระทู้'}
      </button>
    </form>
  );
}
