import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { requireUser } from '@/lib/dal';
import { getProfileByUsername } from '@/lib/supabase/queries/profiles';

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await getProfileByUsername(user.username);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="card p-8">
        <div className="flex items-center gap-5">
          <div
            style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: profile?.avatarUrl ? `url(${profile.avatarUrl}) center/cover` : 'var(--gradient-hero)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: 700, color: 'white', flexShrink: 0,
            }}
          >
            {!profile?.avatarUrl && (profile?.displayName || profile?.username || '?').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black truncate">{profile?.displayName || profile?.username}</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>@{profile?.username}</p>
          </div>
          <Link href="/profile/edit" className="btn-secondary flex-shrink-0">
            <Pencil size={14} />
            แก้ไข
          </Link>
        </div>

        {profile?.bio && (
          <p className="text-sm mt-6" style={{ color: 'var(--text-primary)' }}>
            {profile.bio}
          </p>
        )}

        <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--border-color)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>อีเมล: {user.email}</p>
        </div>
      </div>
    </div>
  );
}
