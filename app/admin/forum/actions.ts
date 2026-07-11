'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/dal';
import { createClient } from '@/lib/supabase/server';

async function updateThread(id: string, patch: Record<string, unknown>) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from('forum_threads').update(patch).eq('id', id);
  revalidatePath('/admin/forum');
  revalidatePath('/community');
}

export async function togglePin(id: string, pinned: boolean) {
  await updateThread(id, { is_pinned: !pinned });
}

export async function toggleLock(id: string, locked: boolean) {
  await updateThread(id, { is_locked: !locked });
}

export async function toggleDelete(id: string, deleted: boolean) {
  await updateThread(id, { deleted_at: deleted ? null : new Date().toISOString() });
}
