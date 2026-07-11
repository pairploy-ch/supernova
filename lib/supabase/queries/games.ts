import { createClient } from '@/lib/supabase/server';
import { logQueryError } from '@/lib/supabase/logError';
import { GAMES, GAMES_LIST, type GameCode, type GameMeta, type GameCharacter, type GameMap } from '@/lib/games';

export interface GameContent {
  code: GameCode;
  tagline: string;
  description: string;
  lore: string;
  bannerImage: string;
  players: string;
  genre: string;
  platform: string;
  characters: GameCharacter[];
  maps: GameMap[];
}

export type GameFull = GameMeta & GameContent;

type GameRow = {
  code: GameCode;
  tagline: string;
  description: string;
  lore: string;
  banner_image_url: string;
  players: string;
  genre: string;
  platform: string;
  characters: GameCharacter[];
  maps: GameMap[];
};

const GAME_COLUMNS = 'code, tagline, description, lore, banner_image_url, players, genre, platform, characters, maps';

const EMPTY_CONTENT: Omit<GameContent, 'code'> = {
  tagline: '',
  description: '',
  lore: '',
  bannerImage: '',
  players: '',
  genre: '',
  platform: '',
  characters: [],
  maps: [],
};

function mapGameRow(row: GameRow): GameContent {
  return {
    code: row.code,
    tagline: row.tagline,
    description: row.description,
    lore: row.lore,
    bannerImage: row.banner_image_url,
    players: row.players,
    genre: row.genre,
    platform: row.platform,
    characters: row.characters ?? [],
    maps: row.maps ?? [],
  };
}

// Merges the static routing/design metadata with DB-editable content. Falls back to
// empty content if the `games` migration/seed hasn't been run yet, so the site doesn't
// hard-crash — pages just render with blank marketing copy until an admin fills it in.
export async function getAllGamesFull(): Promise<GameFull[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('games').select(GAME_COLUMNS);
  logQueryError('getAllGamesFull', error);

  const contentByCode = new Map<GameCode, GameContent>(
    ((data ?? []) as unknown as GameRow[]).map((row) => [row.code, mapGameRow(row)])
  );

  return GAMES_LIST.map((meta) => ({
    ...meta,
    ...(contentByCode.get(meta.code) ?? { code: meta.code, ...EMPTY_CONTENT }),
  }));
}

export async function getGameFullBySlug(slug: string): Promise<GameFull | null> {
  const meta = GAMES_LIST.find((g) => g.slug === slug);
  if (!meta) return null;

  const supabase = await createClient();
  const { data, error } = await supabase.from('games').select(GAME_COLUMNS).eq('code', meta.code).maybeSingle();
  logQueryError('getGameFullBySlug', error);

  const content = data ? mapGameRow(data as unknown as GameRow) : { code: meta.code, ...EMPTY_CONTENT };
  return { ...meta, ...content };
}

export async function getGameContentForAdmin(code: GameCode): Promise<GameFull> {
  const meta = GAMES[code];
  const supabase = await createClient();
  const { data, error } = await supabase.from('games').select(GAME_COLUMNS).eq('code', code).maybeSingle();
  logQueryError('getGameContentForAdmin', error);

  const content = data ? mapGameRow(data as unknown as GameRow) : { code, ...EMPTY_CONTENT };
  return { ...meta, ...content };
}
