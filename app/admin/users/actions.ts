'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/dal';
import { createClient } from '@/lib/supabase/server';

export async function setUserRole(userId: string, role: 'user' | 'admin') {
  const admin = await requireAdmin();

  // Refuse to let an admin demote themselves — that would lock them out of /admin
  // with no other way back in short of another SQL Editor bootstrap.
  if (userId === admin.id && role !== 'admin') return;

  const supabase = await createClient();
  await supabase.from('profiles').update({ role }).eq('id', userId);
  revalidatePath('/admin/users');
}
