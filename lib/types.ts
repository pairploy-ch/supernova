import type { GameCode } from '@/lib/games';

export type ArticleCategory = 'news' | 'event' | 'gaming_gear' | 'aov' | 'mol' | 'val';

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  category: ArticleCategory;
  gameCode: GameCode | null;
  coverImageUrl: string | null;
  authorName: string;
  publishedAt: string | null;
}

export interface ArticleComment {
  id: string;
  articleId: string;
  authorId: string | null;
  authorName: string;
  authorAvatarUrl: string | null;
  body: string;
  createdAt: string;
}

export interface ForumThread {
  id: string;
  slug: string;
  title: string;
  body: string;
  gameCode: GameCode;
  authorId: string | null;
  authorName: string;
  imageUrl: string | null;
  isPinned: boolean;
  isLocked: boolean;
  replyCount: number;
  viewCount: number;
  createdAt: string;
}

export interface ForumReply {
  id: string;
  threadId: string;
  parentReplyId: string | null;
  authorId: string | null;
  authorName: string;
  authorAvatarUrl: string | null;
  imageUrl: string | null;
  body: string;
  createdAt: string;
  children: ForumReply[];
}

export interface PublicProfile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
}
