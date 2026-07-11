'use client';

import { useActionState, useRef, useState } from 'react';
import { Plus, ChevronRight, Check } from 'lucide-react';
import { updateProfile } from './actions';
import { AVATAR_FRAMES } from '@/lib/avatarFrame';
import { GAMES_LIST, type GameCode } from '@/lib/games';
import type { AvatarFrame } from '@/lib/types';

export default function ProfileEditForm({
  username,
  initialDisplayName,
  initialBio,
  initialAvatarUrl,
  initialCoverImageUrl,
  initialAvatarFrame,
  initialGameIds,
}: {
  username: string;
  initialDisplayName: string;
  initialBio: string;
  initialAvatarUrl: string | null;
  initialCoverImageUrl: string | null;
  initialAvatarFrame: AvatarFrame;
  initialGameIds: Partial<Record<GameCode, string>>;
}) {
  const [state, action, pending] = useActionState(updateProfile, undefined);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialAvatarUrl);
  const [coverPreview, setCoverPreview] = useState<string | null>(initialCoverImageUrl);
  const [frame, setFrame] = useState<AvatarFrame>(initialAvatarFrame);
  const [selectedGames, setSelectedGames] = useState<Set<GameCode>>(
    new Set(Object.keys(initialGameIds) as GameCode[])
  );
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  return (
    <form action={action}>
      <input type="hidden" name="avatarFrame" value={frame} />

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

      <div className="form-row">
        <div className="form-item">
          <label className="form-label">Cover Photo</label>
          <div
            onClick={() => coverInputRef.current?.click()}
            style={{
              height: '120px', cursor: 'pointer', position: 'relative',
              background: coverPreview ? `url(${coverPreview}) center/cover` : 'var(--gradient-hero)',
            }}
          >
            <div
              style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(0,0,0,0.25)', color: 'white', fontSize: '12px', fontWeight: 700,
              }}
            >
              <Plus size={14} style={{ marginRight: '4px' }} /> เปลี่ยนภาพปก
            </div>
            <input
              ref={coverInputRef}
              name="cover"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setCoverPreview(URL.createObjectURL(file));
              }}
            />
          </div>
          <p className="form-item-message">แนะนำขนาด 1200x300px</p>
        </div>
      </div>

      <div className="form-row" style={{ alignItems: 'center' }}>
        <div className="form-item" style={{ flex: 'none' }}>
          <label className="form-label">Profile Photo</label>
          <div className="avatar-change">
            <div
              className="user-avatar-big"
              style={{ background: avatarPreview ? `url(${avatarPreview}) center/cover` : 'var(--gradient-hero)' }}
            />
            <button
              type="button"
              className="bubble-ornament"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="เปลี่ยนรูปโปรไฟล์"
            >
              <Plus size={16} />
            </button>
            <input
              ref={avatarInputRef}
              name="avatar"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setAvatarPreview(URL.createObjectURL(file));
              }}
            />
          </div>
          <p className="form-item-message">100x100px minimum resolution</p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-item">
          <label className="form-label">Avatar Frame</label>
          <div className="flex gap-3">
            {AVATAR_FRAMES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFrame(f.id)}
                title={f.label}
                style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  padding: f.id === 'none' ? 0 : '3px',
                  background: f.ring, border: f.id === 'none' ? '2px dashed var(--border-color)' : 'none',
                  cursor: 'pointer', position: 'relative', flexShrink: 0,
                }}
              >
                <span style={{ display: 'block', width: '100%', height: '100%', borderRadius: '50%', background: '#fff' }} />
                {frame === f.id && (
                  <span
                    style={{
                      position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: f.id === 'none' ? 'var(--text-muted)' : f.ring,
                    }}
                  >
                    <Check size={14} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="form-row">
        <div className="form-item">
          <label className="form-label">เกมที่เล่น</label>
          <div className="flex flex-col gap-3">
            {GAMES_LIST.map((g) => {
              const checked = selectedGames.has(g.code);
              return (
                <div key={g.code} className="flex items-center gap-3">
                  <label className="flex items-center gap-2" style={{ cursor: 'pointer', minWidth: '140px' }}>
                    <input
                      type="checkbox"
                      name={`game_${g.code}`}
                      checked={checked}
                      onChange={(e) => {
                        setSelectedGames((prev) => {
                          const next = new Set(prev);
                          if (e.target.checked) next.add(g.code);
                          else next.delete(g.code);
                          return next;
                        });
                      }}
                    />
                    <span className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.accent, display: 'inline-block' }} />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{g.name}</span>
                  </label>
                  {checked && (
                    <input
                      className="form-input-pill"
                      style={{ flex: 1 }}
                      name={`gameId_${g.code}`}
                      placeholder={`${g.name} ID`}
                      defaultValue={initialGameIds[g.code] ?? ''}
                      maxLength={40}
                    />
                  )}
                </div>
              );
            })}
          </div>
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
