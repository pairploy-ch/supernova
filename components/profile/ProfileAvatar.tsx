import { frameRingColor } from '@/lib/avatarFrame';
import type { AvatarFrame } from '@/lib/types';

export default function ProfileAvatar({
  avatarUrl,
  name,
  frame,
  size = 96,
}: {
  avatarUrl: string | null;
  name: string;
  frame: AvatarFrame;
  size?: number;
}) {
  const ring = frameRingColor(frame);
  const framed = frame !== 'none';
  const ringWidth = framed ? Math.max(2, Math.round(size * 0.045)) : 0;
  const innerBorder = framed ? Math.max(1, Math.round(size * 0.03)) : 0;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        padding: ringWidth,
        background: ring,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: avatarUrl ? `url(${avatarUrl}) center/cover` : 'var(--gradient-hero)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.36,
          fontWeight: 700,
          color: 'white',
          border: innerBorder ? `${innerBorder}px solid #fff` : 'none',
        }}
      >
        {!avatarUrl && name.charAt(0).toUpperCase()}
      </div>
    </div>
  );
}
