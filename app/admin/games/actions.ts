'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/dal';
import { createClient } from '@/lib/supabase/server';
import type { GameCode } from '@/lib/games';

export type GameFormState = { error?: string } | undefined;

const VALID_CODES: GameCode[] = ['aov', 'mol', 'val'];

const characterSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  quote: z.string().min(1),
  image: z.string().min(1),
});

const mapSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().min(1),
});

const gameSchema = z.object({
  tagline: z.string().min(1, 'กรุณากรอก tagline').max(200),
  description: z.string().min(1, 'กรุณากรอกคำอธิบาย').max(500),
  lore: z.string().min(1, 'กรุณากรอกเนื้อเรื่อง'),
  bannerImage: z.string().min(1, 'กรุณากรอก URL รูปแบนเนอร์'),
  players: z.string().max(50).optional().default(''),
  genre: z.string().max(50).optional().default(''),
  platform: z.string().max(50).optional().default(''),
  characters: z.array(characterSchema).max(12),
  maps: z.array(mapSchema).max(12),
});

export async function updateGameContent(_prevState: GameFormState, formData: FormData): Promise<GameFormState> {
  await requireAdmin();

  const code = formData.get('code')?.toString() as GameCode;
  if (!VALID_CODES.includes(code)) return { error: 'ไม่พบเกมนี้' };

  let characters: unknown;
  let maps: unknown;
  try {
    characters = JSON.parse(formData.get('characters')?.toString() || '[]');
    maps = JSON.parse(formData.get('maps')?.toString() || '[]');
  } catch {
    return { error: 'ข้อมูลตัวละครหรือแผนที่ไม่ถูกต้อง' };
  }

  const parsed = gameSchema.safeParse({
    tagline: formData.get('tagline'),
    description: formData.get('description'),
    lore: formData.get('lore'),
    bannerImage: formData.get('bannerImage'),
    players: formData.get('players'),
    genre: formData.get('genre'),
    platform: formData.get('platform'),
    characters,
    maps,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('games').upsert({
    code,
    tagline: parsed.data.tagline,
    description: parsed.data.description,
    lore: parsed.data.lore,
    banner_image_url: parsed.data.bannerImage,
    players: parsed.data.players,
    genre: parsed.data.genre,
    platform: parsed.data.platform,
    characters: parsed.data.characters,
    maps: parsed.data.maps,
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: 'บันทึกไม่สำเร็จ: ' + error.message };

  revalidatePath('/admin/games');
  revalidatePath(`/admin/games/${code}/edit`);
  revalidatePath('/games');
  revalidatePath(`/games/${code}`);
  revalidatePath('/');
  redirect('/admin/games');
}
