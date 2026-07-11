const thaiDateFormatter = new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

export function formatThaiDate(iso: string | null): string {
  if (!iso) return '';
  return thaiDateFormatter.format(new Date(iso));
}

const MONTH_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function ordinalSuffix(n: number): string {
  const j = n % 10;
  const k = n % 100;
  if (j === 1 && k !== 11) return 'ST';
  if (j === 2 && k !== 12) return 'ND';
  if (j === 3 && k !== 13) return 'RD';
  return 'TH';
}

// Compact forum-style activity stamp: "36M" / "2H" / "APR 8TH".
export function formatRelativeCompact(iso: string | null): string {
  if (!iso) return '';
  const date = new Date(iso);
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return 'NOW';
  if (minutes < 60) return `${minutes}M`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H`;
  const day = date.getDate();
  return `${MONTH_SHORT[date.getMonth()]} ${day}${ordinalSuffix(day)}`;
}

export function formatCompactNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return String(n);
}

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];

// "TUESDAY, MAY 14TH"
export function formatEventDateHeading(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  const day = d.getDate();
  return `${WEEKDAYS[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${day}${ordinalSuffix(day)}`;
}

// "10:00 PM"
export function formatEventTime(iso: string | null): string {
  if (!iso) return '';
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(new Date(iso));
}
