import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticleBySlug, getLatestArticles } from '@/lib/supabase/queries/articles';
import { formatEventDateHeading, formatEventTime } from '@/lib/formatDate';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import type { Article } from '@/lib/types';

const DOT_COLORS = [
  'var(--cat-blue)', 'var(--cat-purple)', 'var(--cat-teal)',
  'var(--cat-pink)', 'var(--cat-green)', 'var(--cat-orange)',
];

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
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

function DetailRow({ label, value, shaded }: { label: string; value: string; shaded: boolean }) {
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6"
      style={{ padding: '14px 20px', background: shaded ? 'var(--bg-card)' : 'transparent' }}
    >
      <span
        className="sm:w-40 flex-shrink-0"
        style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-muted)' }}
      >
        {label}
      </span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getArticleBySlug(slug);
  if (!event || event.category !== 'event') notFound();

  const allEvents = await getLatestArticles(200, { category: 'event' });
  const sortedAsc = [...allEvents].sort(
    (a, b) => new Date(a.publishedAt ?? 0).getTime() - new Date(b.publishedAt ?? 0).getTime()
  );
  const colorByEventId = new Map(sortedAsc.map((ev, i) => [ev.id, DOT_COLORS[i % DOT_COLORS.length]]));

  const now = new Date();
  const todayKey = dateKey(now);
  const others = sortedAsc.filter((ev) => ev.id !== event.id);
  const future = others.filter((ev) => ev.publishedAt && dateKey(new Date(ev.publishedAt)) >= todayKey);
  const past = [...others].reverse().filter((ev) => ev.publishedAt && dateKey(new Date(ev.publishedAt)) < todayKey);
  const upcoming = (future.length > 0 ? future : past).slice(0, 6);
  const upcomingGroups = groupByDate(upcoming);

  const rows: { label: string; value: string }[] = [
    { label: 'Event Name', value: event.title },
  ];
  if (event.publishedAt) {
    rows.push({ label: 'Date', value: formatEventDateHeading(event.publishedAt) });
    rows.push({ label: 'Time', value: formatEventTime(event.publishedAt) });
  }
  rows.push({ label: 'Organizer', value: event.authorName });

  return (
    <div>
      <div className="page-hero orange">
        <h1>{event.title}</h1>
        <p className="breadcrumb">
          <Link href="/">Home</Link> / <Link href="/events">Events Calendar</Link> / Details
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main */}
          <div>
            <div className="section-title-wrap blue" style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#111', fontWeight: 500, fontSize: '16px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                Events Details
              </h2>
            </div>

            <div
              className="mb-6"
              style={{
                height: '300px',
                background: event.coverImageUrl
                  ? `url(${event.coverImageUrl}) center/cover`
                  : 'linear-gradient(135deg, var(--accent-pink), var(--accent-purple))',
              }}
            />

            <div className="card mb-10">
              {rows.map((row, i) => (
                <DetailRow key={row.label} label={row.label} value={row.value} shaded={i % 2 === 0} />
              ))}
            </div>

            <div className="section-title-wrap blue" style={{ marginBottom: '20px' }}>
              <h2 style={{ color: '#111', fontWeight: 500, fontSize: '16px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                Events Information
              </h2>
            </div>
            <MarkdownRenderer>{event.body}</MarkdownRenderer>
          </div>

          {/* Sidebar */}
          <div style={{ alignSelf: 'start' }}>
            <div className="section-title-wrap blue" style={{ marginBottom: '16px' }}>
              <h3 style={{ color: '#111', fontWeight: 500, fontSize: '14px', letterSpacing: '0.05em', textTransform: 'uppercase', margin: 0 }}>
                Upcoming Events
              </h3>
            </div>

            {upcomingGroups.length === 0 && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ยังไม่มีอีเว้นท์</p>
            )}

            {upcomingGroups.map((group) => (
              <div key={group.key} className="mb-2">
                <p
                  className="text-[10px] font-bold mt-3 mb-1"
                  style={{ color: 'var(--text-muted)', letterSpacing: '0.04em', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}
                >
                  {formatEventDateHeading(group.date.toISOString())}
                </p>
                {group.items.map((ev) => (
                  <Link
                    key={ev.id}
                    href={`/events/${ev.slug}`}
                    className="flex gap-3"
                    style={{ borderBottom: '1px solid var(--border-color)', padding: '12px 0' }}
                  >
                    <span
                      style={{
                        width: '11px', height: '11px', borderRadius: '50%', flexShrink: 0, marginTop: '3px',
                        border: `2px solid ${colorByEventId.get(ev.id)}`, background: '#fff',
                      }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold" style={{ color: colorByEventId.get(ev.id) }}>
                        {formatEventTime(ev.publishedAt)}
                      </p>
                      <p className="text-xs font-bold mt-1" style={{ color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                        {ev.title}
                      </p>
                      {ev.excerpt && (
                        <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                          {ev.excerpt}
                        </p>
                      )}
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
