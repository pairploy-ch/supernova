export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80);
}

// Appends a short random suffix so two threads/articles with the same title don't collide.
export function uniqueSlug(input: string): string {
  const base = slugify(input) || 'post';
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}
