'use client';

import { useActionState, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { GameFormState } from './actions';
import type { GameFull } from '@/lib/supabase/queries/games';
import type { GameCharacter, GameMap } from '@/lib/games';

const EMPTY_CHARACTER: GameCharacter = { name: '', role: '', quote: '', image: '' };
const EMPTY_MAP: GameMap = { name: '', description: '', image: '' };

export default function GameContentForm({
  action,
  game,
}: {
  action: (state: GameFormState, formData: FormData) => Promise<GameFormState>;
  game: GameFull;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const [characters, setCharacters] = useState<GameCharacter[]>(game.characters);
  const [maps, setMaps] = useState<GameMap[]>(game.maps);

  function updateCharacter(i: number, patch: Partial<GameCharacter>) {
    setCharacters((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));
  }

  function updateMap(i: number, patch: Partial<GameMap>) {
    setMaps((prev) => prev.map((m, idx) => (idx === i ? { ...m, ...patch } : m)));
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="code" value={game.code} />
      <input type="hidden" name="characters" value={JSON.stringify(characters)} />
      <input type="hidden" name="maps" value={JSON.stringify(maps)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="form-label" htmlFor="players">จำนวนผู้เล่น</label>
          <input className="form-input" id="players" name="players" type="text" defaultValue={game.players} placeholder="เช่น 500M+" />
        </div>
        <div>
          <label className="form-label" htmlFor="genre">ประเภทเกม</label>
          <input className="form-input" id="genre" name="genre" type="text" defaultValue={game.genre} placeholder="เช่น MOBA" />
        </div>
        <div>
          <label className="form-label" htmlFor="platform">แพลตฟอร์ม</label>
          <input className="form-input" id="platform" name="platform" type="text" defaultValue={game.platform} placeholder="เช่น Mobile" />
        </div>
      </div>

      <div>
        <label className="form-label" htmlFor="tagline">Tagline</label>
        <input className="form-input" id="tagline" name="tagline" type="text" required defaultValue={game.tagline} maxLength={200} />
      </div>

      <div>
        <label className="form-label" htmlFor="description">คำอธิบายสั้น</label>
        <input className="form-input" id="description" name="description" type="text" required defaultValue={game.description} maxLength={500} />
      </div>

      <div>
        <label className="form-label" htmlFor="bannerImage">URL รูปแบนเนอร์</label>
        {game.bannerImage && <img src={game.bannerImage} alt="" style={{ width: '260px', height: '110px', objectFit: 'cover', borderRadius: 0, marginBottom: '8px' }} />}
        <input className="form-input" id="bannerImage" name="bannerImage" type="text" required defaultValue={game.bannerImage} placeholder="https://..." />
      </div>

      <div>
        <label className="form-label" htmlFor="lore">เนื้อเรื่อง (Lore)</label>
        <textarea className="form-input" id="lore" name="lore" required rows={6} defaultValue={game.lore} />
      </div>

      {/* Characters */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="form-label" style={{ margin: 0 }}>ตัวละคร (Heroes)</label>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => setCharacters((prev) => [...prev, { ...EMPTY_CHARACTER }])}
          >
            <Plus size={13} /> เพิ่มตัวละคร
          </button>
        </div>
        <div className="space-y-3">
          {characters.map((c, i) => (
            <div key={i} className="card p-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '8px', alignItems: 'start' }}>
              <input className="form-input" type="text" placeholder="ชื่อ" value={c.name} onChange={(e) => updateCharacter(i, { name: e.target.value })} />
              <input className="form-input" type="text" placeholder="บทบาท" value={c.role} onChange={(e) => updateCharacter(i, { role: e.target.value })} />
              <input className="form-input" type="text" placeholder="คำคม" value={c.quote} onChange={(e) => updateCharacter(i, { quote: e.target.value })} />
              <input className="form-input" type="text" placeholder="URL รูป" value={c.image} onChange={(e) => updateCharacter(i, { image: e.target.value })} />
              <button
                type="button"
                title="ลบตัวละคร"
                style={{ color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                onClick={() => setCharacters((prev) => prev.filter((_, idx) => idx !== i))}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {characters.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ยังไม่มีตัวละคร</p>
          )}
        </div>
      </div>

      {/* Maps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="form-label" style={{ margin: 0 }}>แผนที่ (Maps)</label>
          <button
            type="button"
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => setMaps((prev) => [...prev, { ...EMPTY_MAP }])}
          >
            <Plus size={13} /> เพิ่มแผนที่
          </button>
        </div>
        <div className="space-y-3">
          {maps.map((m, i) => (
            <div key={i} className="card p-3" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '8px', alignItems: 'start' }}>
              <input className="form-input" type="text" placeholder="ชื่อแผนที่" value={m.name} onChange={(e) => updateMap(i, { name: e.target.value })} />
              <input className="form-input" type="text" placeholder="คำอธิบาย" value={m.description} onChange={(e) => updateMap(i, { description: e.target.value })} />
              <input className="form-input" type="text" placeholder="URL รูป" value={m.image} onChange={(e) => updateMap(i, { image: e.target.value })} />
              <button
                type="button"
                title="ลบแผนที่"
                style={{ color: '#e11d48', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                onClick={() => setMaps((prev) => prev.filter((_, idx) => idx !== i))}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {maps.length === 0 && (
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ยังไม่มีแผนที่</p>
          )}
        </div>
      </div>

      {state?.error && <p className="form-error">{state.error}</p>}

      <button className="btn-primary" type="submit" disabled={pending}>
        {pending ? 'กำลังบันทึก...' : 'บันทึก'}
      </button>
    </form>
  );
}
