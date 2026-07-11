import { notFound } from 'next/navigation';
import { getProfileByUsername } from '@/lib/supabase/queries/profiles';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);

  if (!profile) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="card p-8">
        <div className="flex items-center gap-5">
          <div
            style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: profile.avatarUrl ? `url(${profile.avatarUrl}) center/cover` : 'var(--gradient-hero)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '28px', fontWeight: 700, color: 'white', flexShrink: 0,
            }}
          >
            {!profile.avatarUrl && (profile.displayName || profile.username).charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-black truncate">{profile.displayName || profile.username}</h1>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>@{profile.username}</p>
          </div>
        </div>

        {profile.bio && (
          <p className="text-sm mt-6" style={{ color: 'var(--text-primary)' }}>
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  );
}
