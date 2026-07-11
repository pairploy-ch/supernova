import { requireUser } from '@/lib/dal';
import { getProfileByUsername, getUserStats } from '@/lib/supabase/queries/profiles';
import { getThreadsByAuthor } from '@/lib/supabase/queries/forum';
import ProfileView from '@/components/profile/ProfileView';

export default async function ProfilePage() {
  const user = await requireUser();
  const [profile, stats, threads] = await Promise.all([
    getProfileByUsername(user.username),
    getUserStats(user.id),
    getThreadsByAuthor(user.id),
  ]);

  if (!profile) return null;

  return <ProfileView profile={profile} stats={stats} threads={threads} isOwnProfile />;
}
