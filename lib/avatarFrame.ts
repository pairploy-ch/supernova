import type { AvatarFrame } from '@/lib/types';

export const AVATAR_FRAMES: { id: AvatarFrame; label: string; ring: string }[] = [
  { id: 'none', label: 'ไม่มี', ring: 'transparent' },
  { id: 'pink', label: 'ชมพู', ring: 'var(--accent-pink)' },
  { id: 'purple', label: 'ม่วง', ring: 'var(--accent-purple)' },
  { id: 'gold', label: 'ทอง', ring: 'var(--cat-orange)' },
];

export function frameRingColor(frame: AvatarFrame): string {
  return AVATAR_FRAMES.find((f) => f.id === frame)?.ring ?? 'transparent';
}
