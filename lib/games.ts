// Static structural registry for the 3 games: routing (slug), identity (name/subtitle),
// and design tokens (accent color, background gradient). This stays static because it's
// tied to routing and the site's design system, not editorial content.
//
// Marketing content (tagline, lore, banner, heroes, maps) is admin-editable and lives in
// the `games` DB table instead — see lib/supabase/queries/games.ts.

export type GameCode = 'aov' | 'mol' | 'val';

export interface GameCharacter {
  name: string;
  role: string;
  quote: string;
  image: string;
}

export interface GameMap {
  name: string;
  description: string;
  image: string;
}

export interface GameMeta {
  code: GameCode;
  slug: string;
  name: string;
  subtitle: string;
  bg: string;
  accent: string;
  emoji: string;
}

export const GAMES: Record<GameCode, GameMeta> = {
  mol: {
    code: 'mol',
    slug: 'mobile-legends',
    name: 'MOBILE LEGENDS',
    subtitle: 'Bang Bang',
    bg: 'linear-gradient(135deg, #0d1a33 0%, #1a3a5c 50%, #0a0a1a 100%)',
    accent: '#9b4dca',
    emoji: '⚔️',
  },
  aov: {
    code: 'aov',
    slug: 'aov',
    name: 'AOV',
    subtitle: 'Arena of Valor',
    bg: 'linear-gradient(135deg, #1a1000 0%, #3d2800 50%, #1a0a00 100%)',
    accent: '#f59e0b',
    emoji: '🏟️',
  },
  val: {
    code: 'val',
    slug: 'valorant',
    name: 'VALORANT',
    subtitle: 'Tactical Shooter',
    bg: 'linear-gradient(135deg, #1a0505 0%, #2d0a0a 50%, #0a0a1a 100%)',
    accent: '#ff4655',
    emoji: '🎯',
  },
};

export const GAMES_LIST: GameMeta[] = Object.values(GAMES);

export function getGameBySlug(slug: string): GameMeta | undefined {
  return GAMES_LIST.find((g) => g.slug === slug);
}
