'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/dal';
import { createClient } from '@/lib/supabase/server';

export type ProfileFormState = { error?: string } | undefined;

const MAX_AVATAR_BYTES = 3 * 1024 * 1024;
const ALLOWED_AVATAR_TYPES = ['image/png', 'image/jpeg', 'image/webp'];

const profileSchema = z.object({
  displayName: z.string().max(40, 'ชื่อที่แสดงต้องไม่เกิน 40 ตัวอักษร').optional(),
  bio: z.string().max(280, 'แนะนำตัวต้องไม่เกิน 280 ตัวอักษร').optional(),
});

export async function updateProfile(_prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    displayName: formData.get('displayName')?.toString() || undefined,
    bio: formData.get('bio')?.toString() || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' };
  }

  const supabase = await createClient();
  const avatarFile = formData.get('avatar');
  let avatarPath: string | undefined;

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!ALLOWED_AVATAR_TYPES.includes(avatarFile.type)) {
      return { error: 'รองรับเฉพาะไฟล์ PNG, JPEG หรือ WEBP' };
    }
    if (avatarFile.size > MAX_AVATAR_BYTES) {
      return { error: 'ไฟล์รูปต้องมีขนาดไม่เกิน 3MB' };
    }

    const ext = avatarFile.type === 'image/png' ? 'png' : avatarFile.type === 'image/webp' ? 'webp' : 'jpg';
    avatarPath = `${user.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarPath, avatarFile, { upsert: true, contentType: avatarFile.type });

    if (uploadError) return { error: 'อัปโหลดรูปไม่สำเร็จ: ' + uploadError.message };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: parsed.data.displayName ?? null,
      bio: parsed.data.bio ?? null,
      ...(avatarPath ? { avatar_url: avatarPath } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { error: 'บันทึกไม่สำเร็จ: ' + error.message };

  redirect('/profile');
}
