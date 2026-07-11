'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/dal';
import { createClient } from '@/lib/supabase/server';
import { GAMES_LIST } from '@/lib/games';

export type ProfileFormState = { error?: string } | undefined;

const MAX_AVATAR_BYTES = 3 * 1024 * 1024;
const MAX_COVER_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const AVATAR_FRAMES = ['none', 'pink', 'purple', 'gold'] as const;

const profileSchema = z.object({
  displayName: z.string().max(40, 'ชื่อที่แสดงต้องไม่เกิน 40 ตัวอักษร').optional(),
  bio: z.string().max(280, 'แนะนำตัวต้องไม่เกิน 280 ตัวอักษร').optional(),
  avatarFrame: z.enum(AVATAR_FRAMES).default('none'),
});

function extFor(type: string) {
  return type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg';
}

export async function updateProfile(_prevState: ProfileFormState, formData: FormData): Promise<ProfileFormState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    displayName: formData.get('displayName')?.toString() || undefined,
    bio: formData.get('bio')?.toString() || undefined,
    avatarFrame: formData.get('avatarFrame')?.toString() || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' };
  }

  const supabase = await createClient();
  const avatarFile = formData.get('avatar');
  const coverFile = formData.get('cover');
  let avatarPath: string | undefined;
  let coverPath: string | undefined;

  const gameIds: Partial<Record<string, string>> = {};
  for (const g of GAMES_LIST) {
    if (formData.get(`game_${g.code}`) === 'on') {
      gameIds[g.code] = (formData.get(`gameId_${g.code}`)?.toString() || '').trim().slice(0, 40);
    }
  }

  if (avatarFile instanceof File && avatarFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(avatarFile.type)) {
      return { error: 'รองรับเฉพาะไฟล์ PNG, JPEG หรือ WEBP' };
    }
    if (avatarFile.size > MAX_AVATAR_BYTES) {
      return { error: 'ไฟล์รูปโปรไฟล์ต้องมีขนาดไม่เกิน 3MB' };
    }

    avatarPath = `${user.id}/avatar.${extFor(avatarFile.type)}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(avatarPath, avatarFile, { upsert: true, contentType: avatarFile.type });

    if (uploadError) return { error: 'อัปโหลดรูปโปรไฟล์ไม่สำเร็จ: ' + uploadError.message };
  }

  if (coverFile instanceof File && coverFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(coverFile.type)) {
      return { error: 'รองรับเฉพาะไฟล์ PNG, JPEG หรือ WEBP' };
    }
    if (coverFile.size > MAX_COVER_BYTES) {
      return { error: 'ไฟล์ภาพปกต้องมีขนาดไม่เกิน 5MB' };
    }

    coverPath = `${user.id}/cover.${extFor(coverFile.type)}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(coverPath, coverFile, { upsert: true, contentType: coverFile.type });

    if (uploadError) return { error: 'อัปโหลดภาพปกไม่สำเร็จ: ' + uploadError.message };
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: parsed.data.displayName ?? null,
      bio: parsed.data.bio ?? null,
      avatar_frame: parsed.data.avatarFrame,
      game_ids: gameIds,
      ...(avatarPath ? { avatar_url: avatarPath } : {}),
      ...(coverPath ? { cover_image_url: coverPath } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  if (error) return { error: 'บันทึกไม่สำเร็จ: ' + error.message };

  redirect('/profile');
}
