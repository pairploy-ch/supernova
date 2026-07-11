import type { ArticleCategory } from '@/lib/types';

export const ARTICLE_CATEGORY_META: Record<
  ArticleCategory,
  { label: string; tagClass: string; filterLabel: string; hex: string; sectionColor: string }
> = {
  news: { label: 'NEWS', tagClass: 'tag-news', filterLabel: 'ข่าว', hex: '#1c95f3', sectionColor: 'blue' },
  event: { label: 'EVENT', tagClass: 'tag-event', filterLabel: 'Event', hex: '#ffb400', sectionColor: 'orange' },
  gaming_gear: { label: 'GEAR', tagClass: 'tag-gaming-gear', filterLabel: 'Gaming Gear', hex: '#58d819', sectionColor: 'green' },
  aov: { label: 'ROV', tagClass: 'tag-aov', filterLabel: 'ROV', hex: '#7442ce', sectionColor: 'purple' },
  mol: { label: 'MOL', tagClass: 'tag-mol', filterLabel: 'Mobile Legends', hex: '#00c9b8', sectionColor: 'teal' },
  val: { label: 'VALORANT', tagClass: 'tag-valorant', filterLabel: 'Valorant', hex: '#f30a5c', sectionColor: 'pink' },
};

export const ARTICLE_CATEGORIES: ArticleCategory[] = ['news', 'aov', 'mol', 'val', 'event', 'gaming_gear'];
