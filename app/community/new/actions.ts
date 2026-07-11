'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { requireUser } from '@/lib/dal';
import { createClient } from '@/lib/supabase/server';
import { uniqueSlug } from '@/lib/slugify';

export type CreateThreadFormState = { error?: string } | undefined;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

const createThreadSchema = z.object({
  title: z.string().min(4, 'หัวข้อต้องมีอย่างน้อย 4 ตัวอักษร').max(150, 'หัวข้อยาวเกินไป'),
  body: z.string().min(1, 'กรุณากรอกเนื้อหากระทู้').max(10000, 'เนื้อหายาวเกินไป'),
  gameCode: z.enum(['aov', 'mol', 'val']),
});

export async function createThread(_prevState: CreateThreadFormState, formData: FormData): Promise<CreateThreadFormState> {
  const user = await requireUser();

  const parsed = createThreadSchema.safeParse({
    title: formData.get('title'),
    body: formData.get('body'),
    gameCode: formData.get('gameCode'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' };
  }

  const supabase = await createClient();
  const imageFile = formData.get('image');
  let imagePath: string | undefined;

  if (imageFile instanceof File && imageFile.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
      return { error: 'รองรับเฉพาะไฟล์ PNG, JPEG, WEBP หรือ GIF' };
    }
    if (imageFile.size > MAX_IMAGE_BYTES) {
      return { error: 'ไฟล์รูปต้องมีขนาดไม่เกิน 5MB' };
    }

    const ext = imageFile.name.split('.').pop() || 'jpg';
    imagePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('forum-attachments')
      .upload(imagePath, imageFile, { contentType: imageFile.type });

    if (uploadError) return { error: 'อัปโหลดรูปไม่สำเร็จ: ' + uploadError.message };
  }

  const slug = uniqueSlug(parsed.data.title);

  const { error } = await supabase.from('forum_threads').insert({
    slug,
    title: parsed.data.title,
    body: parsed.data.body,
    game_code: parsed.data.gameCode,
    author_id: user.id,
    image_path: imagePath ?? null,
  });

  if (error) return { error: 'สร้างกระทู้ไม่สำเร็จ: ' + error.message };

  redirect(`/community/${slug}`);
}
