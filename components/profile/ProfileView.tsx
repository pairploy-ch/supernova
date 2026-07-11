import Link from 'next/link';
import { Pencil, MessageSquare } from 'lucide-react';
import ProfileAvatar from './ProfileAvatar';
import { formatThaiDate, formatRelativeCompact, formatCompactNumber } from '@/lib/formatDate';
import { GAMES, GAMES_LIST } from '@/lib/games';
import { stripMarkdown } from '@/lib/text';
import type { PublicProfile, ForumThread } from '@/lib/types';
import type { UserStats } from '@/lib/supabase/queries/profiles';

export default function ProfileView({
  profile,
  stats,
  threads,
  isOwnProfile,
}: {
  profile: PublicProfile;
  stats: UserStats;
  threads: ForumThread[];
  isOwnProfile: boolean;
}) {
  const name = profile.displayName || profile.username;

  return (
    <div>
      {/* Cover */}
      <div
        style={{
          height: '220px',
          background: profile.coverImageUrl ? `url(${profile.coverImageUrl}) center/cover` : 'var(--gradient-hero)',
        }}
      />

      <div className="max-w-5xl mx-auto px-4">
        {/* Avatar overlapping cover, centered */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-56px' }}>
          <ProfileAvatar avatarUrl={profile.avatarUrl} name={name} frame={profile.avatarFrame} size={112} />
        </div>

        <div className="text-center mt-3">
          <h1 className="text-xl font-medium" style={{ color: 'var(--text-primary)' }}>{name}</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>@{profile.username}</p>
        </div>

        {isOwnProfile && (
          <div className="flex justify-center mt-3">
            <Link href="/profile/edit" className="btn-primary text-sm" style={{ background: 'var(--accent-pink)' }}>
              <Pencil size={13} /> แก้ไขโปรไฟล์
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="flex justify-center gap-10 mt-6 pb-6" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{stats.threadCount}</div>
            <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>กระทู้</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{stats.replyCount}</div>
            <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>ตอบกลับ</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{stats.commentCount}</div>
            <div className="text-[10px] uppercase" style={{ color: 'var(--text-muted)', letterSpacing: '0.06em' }}>คอมเมนต์</div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 py-8">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* About Me */}
            <div className="card p-5 h-fit">
              <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>About Me</h3>
              {profile.bio ? (
                <p className="text-sm mb-4" style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}>{profile.bio}</p>
              ) : (
                <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>ยังไม่มีคำแนะนำตัว</p>
              )}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  เข้าร่วมเมื่อ <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{formatThaiDate(profile.createdAt)}</span>
                </p>
              </div>
            </div>

            {/* Games played */}
            {Object.keys(profile.gameIds).length > 0 && (
              <div className="card p-5 h-fit">
                <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>เกมที่เล่น</h3>
                <div className="flex flex-col gap-3">
                  {GAMES_LIST.filter((g) => g.code in profile.gameIds).map((g) => (
                    <div key={g.code} className="flex items-center gap-2">
                      <span className="dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: g.accent, display: 'inline-block', flexShrink: 0 }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{g.name}</span>
                      {profile.gameIds[g.code] && (
                        <span className="text-xs ml-auto" style={{ color: 'var(--text-muted)' }}>ID: {profile.gameIds[g.code]}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Thread history */}
          <div>
            <h3 className="text-sm font-bold mb-3" style={{ color: 'var(--text-primary)' }}>ประวัติกระทู้</h3>
            <div className="card overflow-hidden">
              <div className="forum-table-head">
                <span>Topic</span>
                <span>Category</span>
                <span>Users</span>
                <span>Replies</span>
                <span>Views</span>
                <span>Activity</span>
              </div>

              {threads.map((t) => (
                <Link key={t.id} href={`/community/${t.slug}`} className="forum-table-row">
                  <div className="forum-table-topic">
                    <h3>
                      <span className="line-clamp-1">{t.title}</span>
                    </h3>
                    {t.body && <p className="line-clamp-1">{stripMarkdown(t.body)}</p>}
                  </div>

                  <div className="forum-table-category">
                    <span className="dot" style={{ background: GAMES[t.gameCode].accent }} />
                    <span style={{ color: GAMES[t.gameCode].accent }}>{GAMES[t.gameCode].name}</span>
                  </div>

                  <div className="forum-table-users">
                    <ProfileAvatar avatarUrl={t.authorAvatarUrl} name={t.authorName} frame={t.authorAvatarFrame} size={28} />
                  </div>

                  <div className="forum-table-replies num-col">{t.replyCount}</div>
                  <div className="forum-table-views num-col">{formatCompactNumber(t.viewCount)}</div>
                  <div className="forum-table-activity num-col">{formatRelativeCompact(t.createdAt)}</div>
                </Link>
              ))}

              {threads.length === 0 && (
                <p className="text-sm py-10 text-center flex items-center justify-center gap-2" style={{ color: 'var(--text-muted)' }}>
                  <MessageSquare size={14} /> ยังไม่เคยตั้งกระทู้
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
