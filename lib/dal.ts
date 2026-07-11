import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { logQueryError } from '@/lib/supabase/logError';

export type CurrentUser = {
  id: string;
  email: string | null;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: 'user' | 'admin';
};

// Memoized per request: safe to call from many Server Components without duplicate round trips.
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('username, display_name, avatar_url, role')
    .eq('id', user.id)
    .single();

  logQueryError('getCurrentUser', error);
  if (!profile) return null;

  return {
    id: user.id,
    email: user.email ?? null,
    username: profile.username,
    displayName: profile.display_name,
    avatarUrl: profile.avatar_url,
    role: profile.role,
  };
});

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect('/login');
  return user;
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== 'admin') redirect('/');
  return user;
}
