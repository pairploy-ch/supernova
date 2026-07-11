import Link from 'next/link';
import { requireUser } from '@/lib/dal';
import { getProfileByUsername, getUserStats } from '@/lib/supabase/queries/profiles';
import ProfileEditForm from './ProfileEditForm';

export default async function ProfileEditPage() {
  const user = await requireUser();
  const [profile, stats] = await Promise.all([
    getProfileByUsername(user.username),
    getUserStats(user.id),
  ]);

  return (
    <div>
      {/* Hero */}
      <div className="page-hero">
        <h1>Your Account</h1>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / {profile?.username}
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <div className="card overflow-hidden h-fit">
            <div className="account-info-wrap">
              <div
                style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: profile?.avatarUrl ? `url(${profile.avatarUrl}) center/cover` : 'var(--gradient-hero)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '26px', fontWeight: 700, color: 'white', margin: '0 auto 12px',
                }}
              >
                {!profile?.avatarUrl && (profile?.displayName || profile?.username || '?').charAt(0).toUpperCase()}
              </div>
              <p className="text-sm font-bold uppercase" style={{ color: 'var(--text-primary)' }}>
                {profile?.username}
              </p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{profile?.displayName}</p>

              <div className="stat-row">
                <div className="stat">
                  <div className="value">{stats.threadCount}</div>
                  <div className="label">กระทู้</div>
                </div>
                <div className="stat">
                  <div className="value">{stats.replyCount}</div>
                  <div className="label">ตอบกลับ</div>
                </div>
                <div className="stat">
                  <div className="value">{stats.commentCount}</div>
                  <div className="label">คอมเมนต์</div>
                </div>
              </div>
            </div>
            <ul className="account-nav">
              <li><span className="account-nav-item active">Account Settings</span></li>
              <li>
                <Link href={`/profile/${user.username}`} className="account-nav-item">
                  Public Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Main form */}
          <div className="card p-8">
            <h2
              style={{
                display: 'inline-block', fontSize: '18px', paddingBottom: '10px',
                borderBottom: '3px solid var(--cat-blue)', marginBottom: '28px',
              }}
            >
              Account Settings
            </h2>
            <ProfileEditForm
              username={profile?.username ?? user.username}
              initialDisplayName={profile?.displayName ?? ''}
              initialBio={profile?.bio ?? ''}
              initialAvatarUrl={profile?.avatarUrl ?? null}
              initialCoverImageUrl={profile?.coverImageUrl ?? null}
              initialAvatarFrame={profile?.avatarFrame ?? 'none'}
              initialGameIds={profile?.gameIds ?? {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
