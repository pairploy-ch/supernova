'use client';

import { useActionState, useRef, useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { updateProfile } from './actions';

export default function ProfileEditForm({
  username,
  initialDisplayName,
  initialBio,
  initialAvatarUrl,
}: {
  username: string;
  initialDisplayName: string;
  initialBio: string;
  initialAvatarUrl: string | null;
}) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  const [preview, setPreview] = useState<string | null>(initialAvatarUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <form action={action}>
      <div className="form-row">
        <div className="form-item">
          <label className="form-label">Username</label>
          <input className="form-input-pill" value={username} disabled />
          <p className="form-item-message">
            people can mention you as <span className="highlight">@{username}</span>
          </p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-item">
          <label className="form-label" htmlFor="displayName">Display Name</label>
          <input className="form-input-pill" id="displayName" name="displayName" defaultValue={initialDisplayName} maxLength={40} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-item">
          <label className="form-label" htmlFor="bio">Bio</label>
          <textarea className="form-input" id="bio" name="bio" defaultValue={initialBio} maxLength={280} rows={4} />
        </div>
      </div>

      <div className="form-row" style={{ alignItems: 'center' }}>
        <div className="form-item" style={{ flex: 'none' }}>
          <label className="form-label">Profile Photo</label>
          <div className="avatar-change">
            <div
              className="user-avatar-big"
              style={{ background: preview ? `url(${preview}) center/cover` : 'var(--gradient-hero)' }}
            />
            <button
              type="button"
              className="bubble-ornament"
              onClick={() => fileInputRef.current?.click()}
              aria-label="เปลี่ยนรูปโปรไฟล์"
            >
              <Plus size={16} />
            </button>
            <input
              ref={fileInputRef}
              name="avatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </div>
          <p className="form-item-message">100x100px minimum resolution</p>
        </div>
      </div>

      {state?.error && <p className="form-error">{state.error}</p>}

      <button className="btn-primary mt-2" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save all changes'}
        <ChevronRight size={14} />
      </button>
    </form>
  );
}
