const thaiDateFormatter = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatThaiDate(iso: string | null): string {
  if (!iso) return '';
  return thaiDateFormatter.format(new Date(iso));
}
