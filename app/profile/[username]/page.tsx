import { notFound } from 'next/navigation';
import { getProfileByUsername, getUserStats } from '@/lib/supabase/queries/profiles';
import { getThreadsByAuthor } from '@/lib/supabase/queries/forum';
import { getCurrentUser } from '@/lib/dal';
import ProfileView from '@/components/profile/ProfileView';

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getProfileByUsername(username);
  if (!profile) notFound();

  const [stats, threads, currentUser] = await Promise.all([
    getUserStats(profile.id),
    getThreadsByAuthor(profile.id),
    getCurrentUser(),
  ]);

  return (
    <ProfileView
      profile={profile}
      stats={stats}
      threads={threads}
      isOwnProfile={currentUser?.username === profile.username}
    />
  );
}
