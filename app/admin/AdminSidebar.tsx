'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Newspaper, MessagesSquare } from 'lucide-react';

const ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/articles', label: 'ข่าว', icon: Newspaper },
  { href: '/admin/forum', label: 'กระทู้', icon: MessagesSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="card p-3 space-y-1">
      {ITEMS.map((item) => {
        const active = item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold transition-colors"
            style={{
              color: active ? 'white' : 'var(--text-primary)',
              background: active ? 'var(--gradient-hero)' : 'transparent',
            }}
          >
            <Icon size={16} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
