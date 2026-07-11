import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Always call this fresh per request/render — never cache the client in a module-level variable.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Throws when called from a Server Component render (no response to attach
          // cookies to). That's fine — proxy.ts refreshes the session on every request,
          // so Server Components only ever need to read, not write, the session cookie.
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // ignore — see comment above
          }
        },
      },
    }
  );
}
