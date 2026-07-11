import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getLatestArticles } from '@/lib/supabase/queries/articles';
import { formatEventDateHeading } from '@/lib/formatDate';
import type { Article } from '@/lib/types';

const WEEKDAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const MONTH_NAMES = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];
const DOT_COLORS = [
  'var(--cat-blue)', 'var(--cat-purple)', 'var(--cat-teal)',
  'var(--cat-pink)', 'var(--cat-green)', 'var(--cat-orange)',
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function dateHeading(d: Date) {
  return formatEventDateHeading(d.toISOString());
}

function normalizeYM(year: number, month: number) {
  const m = ((month % 12) + 12) % 12;
  const y = year + Math.floor(month / 12);
  return { year: y, month: m };
}

interface CalendarCell {
  day: number;
  year: number;
  month: number;
  inMonth: boolean;
}

function buildWeeks(year: number, month: number): CalendarCell[][] {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const prev = normalizeYM(year, month - 1);
  const next = normalizeYM(year, month + 1);

  const cells: CalendarCell[] = [];
  for (let i = firstWeekday - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, year: prev.year, month: prev.month, inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, year, month, inMonth: true });
  }
  let nextDay = 1;
  while (cells.length % 7 !== 0) {
    cells.push({ day: nextDay++, year: next.year, month: next.month, inMonth: false });
  }

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function groupByDate(items: Article[]) {
  const groups: { key: string; date: Date; items: Article[] }[] = [];
  for (const item of items) {
    if (!item.publishedAt) continue;
    const d = new Date(item.publishedAt);
    const key = dateKey(d);
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, date: d, items: [] };
      groups.push(group);
    }
    group.items.push(item);
  }
  return groups;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const sp = await searchParams;
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();
  if (sp.month && /^\d{4}-\d{2}$/.test(sp.month)) {
    const [y, m] = sp.month.split('-').map(Number);
    year = y;
    month = m - 1;
  }

  const events = await getLatestArticles(200, { category: 'event' });
  const sortedAsc = [...events].sort(
    (a, b) => new Date(a.publishedAt ?? 0).getTime() - new Date(b.publishedAt ?? 0).getTime()
  );
  const colorByEventId = new Map(sortedAsc.map((ev, i) => [ev.id, DOT_COLORS[i % DOT_COLORS.length]]));

  const eventsByDate = new Map<string, Article[]>();
  for (const ev of sortedAsc) {
    if (!ev.publishedAt) continue;
    const key = dateKey(new Date(ev.publishedAt));
    eventsByDate.set(key, [...(eventsByDate.get(key) ?? []), ev]);
  }

  const weeks = buildWeeks(year, month);
  const todayKey = dateKey(now);

  const monthEvents = sortedAsc.filter((ev) => {
    if (!ev.publishedAt) return false;
    const d = new Date(ev.publishedAt);
    return d.getFullYear() === year && d.getMonth() === month;
  });
  const monthGroups = groupByDate(monthEvents);

  const future = sortedAsc.filter((ev) => ev.publishedAt && dateKey(new Date(ev.publishedAt)) >= todayKey);
  const past = [...sortedAsc].reverse().filter((ev) => ev.publishedAt && dateKey(new Date(ev.publishedAt)) < todayKey);
  const upcoming = (future.length > 0 ? future : past).slice(0, 6);
  const upcomingGroups = groupByDate(upcoming);

  const prevHref = `/events?month=${normalizeYM(year, month - 1).year}-${pad(normalizeYM(year, month - 1).month + 1)}`;
  const nextHref = `/events?month=${normalizeYM(year, month + 1).year}-${pad(normalizeYM(year, month + 1).month + 1)}`;

  return (
    <div>
      <div className="page-hero orange">
        <h1>Events Calendar</h1>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / Events Calendar
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Calendar + month event list */}
          <div className="card">
            <div className="event-calendar-toolbar">
              <div className="event-calendar-nav">
                <Link href={prevHref} aria-label="เดือนก่อนหน้า">
                  <ChevronLeft size={15} />
                </Link>
              </div>
              <h2>{MONTH_NAMES[month]} {year}</h2>
              <div className="event-calendar-nav">
                <Link href={nextHref} aria-label="เดือนถัดไป">
                  <ChevronRight size={15} />
                </Link>
              </div>
            </div>

            <div className="event-calendar-head">
              {WEEKDAYS.map((w) => (
                <span key={w}>{w}</span>
              ))}
            </div>

            <div className="event-calendar-grid">
              {weeks.flatMap((week, wi) =>
                week.map((cell, ci) => {
                  const cellDate = new Date(cell.year, cell.month, cell.day);
                  const key = dateKey(cellDate);
                  const dayEvents = eventsByDate.get(key) ?? [];
                  const isToday = key === todayKey;
                  return (
                    <div
                      key={`${wi}-${ci}`}
                      className={`event-calendar-cell ${cell.inMonth ? '' : 'outside'} ${isToday ? 'today' : ''}`}
                    >
                      <span className="day-num">{cell.day}</span>
                      {dayEvents.slice(0, 2).map((ev) => (
                        <Link key={ev.id} href={`/events/${ev.slug}`} className="event-dot-item">
                          <span className="dot" style={{ background: colorByEventId.get(ev.id) }} />
                          <span className="line-clamp-1">{ev.title}</span>
                        </Link>
                      ))}
                      {dayEvents.length > 2 && (
                        <span className="event-dot-item">+{dayEvents.length - 2} more</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {monthGroups.length === 0 && (
              <p className="text-sm py-10 text-center" style={{ color: 'var(--text-muted)' }}>
                ไม่มีอีเว้นท์ในเดือนนี้
              </p>
            )}

            {monthGroups.map((group) => (
              <div key={group.key}>
                <div className="event-date-heading">{dateHeading(group.date)}</div>
                {group.items.map((ev) => (
                  <Link key={ev.id} href={`/events/${ev.slug}`} className="event-list-row">
                    <span className="dot" style={{ background: colorByEventId.get(ev.id) }} />
                    <div className="body">
                      <h3>{ev.title}</h3>
                      {ev.excerpt && <p>{ev.excerpt}</p>}
                    </div>
                    <span className="btn-secondary" style={{ padding: '6px 16px', fontSize: '11px', flexShrink: 0 }}>
                      MORE DETAILS
                    </span>
                  </Link>
                ))}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="card p-4" style={{ alignSelf: 'start' }}>
            <h3 className="font-medium text-sm mb-2" style={{ color: 'var(--text-primary)' }}>Upcoming Events</h3>
            {upcomingGroups.length === 0 && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ยังไม่มีอีเว้นท์</p>
            )}
            {upcomingGroups.map((group) => (
              <div key={group.key} className="mb-2">
                <p className="text-[10px] font-bold mt-3 mb-1" style={{ color: 'var(--cat-blue)', letterSpacing: '0.04em' }}>
                  {dateHeading(group.date)}
                </p>
                {group.items.map((ev) => (
                  <Link key={ev.id} href={`/events/${ev.slug}`} className="sidebar-event-row">
                    <span className="dot" style={{ background: colorByEventId.get(ev.id) }} />
                    <div>
                      <h4>{ev.title}</h4>
                      {ev.excerpt && <p className="line-clamp-2">{ev.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
