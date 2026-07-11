'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { requireUser } from '@/lib/dal';
import { createClient } from '@/lib/supabase/server';

export type ReplyFormState = { error?: string } | undefined;

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

const replySchema = z.object({
  threadId: z.string().uuid(),
  slug: z.string().min(1),
  parentReplyId: z.string().uuid().nullable(),
  body: z.string().min(1, 'กรุณากรอกข้อความ').max(5000, 'ข้อความยาวเกินไป'),
});

export async function postReply(_prevState: ReplyFormState, formData: FormData): Promise<ReplyFormState> {
  const user = await requireUser();

  const parsed = replySchema.safeParse({
    threadId: formData.get('threadId'),
    slug: formData.get('slug'),
    parentReplyId: formData.get('parentReplyId') || null,
    body: formData.get('body'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' };
  }

  const supabase = await createClient();

  const { data: thread } = await supabase
    .from('forum_threads')
    .select('is_locked')
    .eq('id', parsed.data.threadId)
    .maybeSingle();

  if (!thread) return { error: 'ไม่พบกระทู้นี้' };
  if (thread.is_locked) return { error: 'กระทู้นี้ถูกล็อกแล้ว ไม่สามารถตอบกลับได้' };

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

  const { error } = await supabase.from('forum_replies').insert({
    thread_id: parsed.data.threadId,
    parent_reply_id: parsed.data.parentReplyId,
    author_id: user.id,
    body: parsed.data.body,
    image_path: imagePath ?? null,
  });

  if (error) return { error: 'ส่งคำตอบไม่สำเร็จ: ' + error.message };

  revalidatePath(`/community/${parsed.data.slug}`);
}
