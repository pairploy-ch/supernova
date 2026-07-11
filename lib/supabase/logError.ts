import type { PostgrestError } from '@supabase/supabase-js';

// Query helpers degrade to empty results on error (so a DB hiccup doesn't crash a public
// page), but that must never happen silently — log so real failures stay debuggable.
export function logQueryError(context: string, error: PostgrestError | null) {
  if (error) console.error(`[supabase] ${context}:`, error.message);
}
