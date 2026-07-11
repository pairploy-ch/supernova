'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isUsernameTaken } from '@/lib/supabase/queries/profiles';

export type AuthFormState = { error?: string; message?: string } | undefined;

const signUpSchema = z.object({
  username: z
    .string()
    .min(3, 'ชื่อผู้ใช้ต้องมีอย่างน้อย 3 ตัวอักษร')
    .max(24, 'ชื่อผู้ใช้ต้องไม่เกิน 24 ตัวอักษร')
    .regex(/^[a-zA-Z0-9_]+$/, 'ใช้ได้เฉพาะตัวอักษร ตัวเลข และ _'),
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(8, 'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร'),
});

export async function signUp(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' };
  }

  const { username, email, password } = parsed.data;

  if (await isUsernameTaken(username)) {
    return { error: 'ชื่อผู้ใช้นี้ถูกใช้แล้ว' };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) return { error: error.message };

  if (!data.session) {
    return { message: 'สมัครสำเร็จ! กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ' };
  }

  redirect('/');
}

const signInSchema = z.object({
  email: z.string().email('อีเมลไม่ถูกต้อง'),
  password: z.string().min(1, 'กรุณากรอกรหัสผ่าน'),
});

export async function signIn(_prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'ข้อมูลไม่ถูกต้อง' };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };

  redirect('/');
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
