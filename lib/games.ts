// Single source of truth for game marketing content + the game_code enum values used in
// Postgres (articles.game_code, forum_threads.game_code). Unifies the three divergent
// hardcoded arrays that used to live in app/games/page.tsx, components/home/GamesBanner.tsx,
// and app/community/page.tsx.
//
// Heroes/maps/lore are static editorial content (not DB-backed) — they change rarely and
// don't need per-row admin CRUD, unlike articles/forum threads which are user/admin generated.

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

export interface GameInfo {
  code: GameCode;
  slug: string;
  name: string;
  subtitle: string;
  tagline: string;
  description: string;
  lore: string;
  bg: string;
  bannerImage: string;
  accent: string;
  emoji: string;
  players: string;
  genre: string;
  platform: string;
  characters: GameCharacter[];
  maps: GameMap[];
}

function unsplash(id: string, w: number) {
  return `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;
}

export const GAMES: Record<GameCode, GameInfo> = {
  mol: {
    code: 'mol',
    slug: 'mobile-legends',
    name: 'MOBILE LEGENDS',
    subtitle: 'Bang Bang',
    tagline: 'Real-Time 5v5 MOBA on Mobile',
    description: 'แบทเทิลโรแยลสุดมันส์กับเพื่อน 5v5 MOBA บนมือถือที่ยิ่งใหญ่ที่สุดในเอเชีย',
    lore: 'ในดินแดนแห่ง Aetheris ทวีปที่ถูกแบ่งแยกด้วยเวทมนตร์โบราณ เหล่านักรบผู้กล้าจากทุกมุมโลกต่างถูกเรียกตัวเข้าสู่สมรภูมิ Land of Dawn เพื่อพิสูจน์ฝีมือและปกป้องแกนพลังงานศักดิ์สิทธิ์ที่หล่อเลี้ยงทั้งทวีป การต่อสู้ครั้งนี้ไม่ใช่แค่เรื่องของชัยชนะ แต่คือชะตากรรมของทั้งโลก',
    bg: 'linear-gradient(135deg, #0d1a33 0%, #1a3a5c 50%, #0a0a1a 100%)',
    bannerImage: unsplash('1550745165-9bc0b252726f', 1600),
    accent: '#00d4ff',
    emoji: '⚔️',
    players: '500M+',
    genre: 'MOBA',
    platform: 'Mobile',
    characters: [
      { name: 'Kael Frostwind', role: 'Assassin', quote: 'ความเร็วคือดาบที่คมที่สุด', image: unsplash('1542751371-adc38448a05e', 500) },
      { name: 'Thara Voss', role: 'Mage', quote: 'เวทมนตร์ไม่เคยโกหก', image: unsplash('1511512578047-dfb367046420', 500) },
      { name: 'Brakka', role: 'Tank', quote: 'ยืนหยัดเพื่อทีมของข้า', image: unsplash('1493711662062-fa541adb3fc8', 500) },
      { name: 'Nyx Shadowblade', role: 'Marksman', quote: 'เป้าหมายเดียว จบในนัดเดียว', image: unsplash('1560419015-7c9196d99832', 500) },
    ],
    maps: [
      { name: 'Land of Dawn', description: 'สมรภูมิมาตรฐาน 3 เลน สำหรับการแข่งขัน 5v5', image: unsplash('1538481199705-c710c4e965fc', 700) },
      { name: 'Twilight Ruins', description: 'แผนที่พิเศษในโหมดอีเวนต์ฤดูกาลใหม่', image: unsplash('1542751110-97427bbecf20', 700) },
      { name: 'Frozen Sanctum', description: 'สนามน้ำแข็งสุดหฤโหด ทัศนวิสัยจำกัด', image: unsplash('1535223289827-a525f6dee96e', 700) },
    ],
  },
  aov: {
    code: 'aov',
    slug: 'aov',
    name: 'AOV',
    subtitle: 'Arena of Valor',
    tagline: 'Real-Time 5v5 MOBA on Mobile',
    description: 'MOBA เกมยอดฮิตบนมือถือจาก Garena พร้อมการแข่งขันระดับโลก',
    lore: 'อาณาจักร Valoria เคยรุ่งเรืองด้วยพลังคริสตัลศักดิ์สิทธิ์ จนกระทั่งสงครามครั้งใหญ่ทำลายสมดุลของโลก บัดนี้เหล่าฮีโร่จากทุกยุคสมัยถูกเรียกกลับมาสู่สมรภูมิ Arena เพื่อชิงชัยและกอบกู้อาณาจักรที่แตกสลาย ทุกการต่อสู้คือหน้าประวัติศาสตร์บทใหม่ของ Valoria',
    bg: 'linear-gradient(135deg, #1a1000 0%, #3d2800 50%, #1a0a00 100%)',
    bannerImage: unsplash('1527814050087-3793815479db', 1600),
    accent: '#f59e0b',
    emoji: '🏟️',
    players: '200M+',
    genre: 'MOBA',
    platform: 'Mobile',
    characters: [
      { name: 'Ignis Warbringer', role: 'Fighter', quote: 'ไฟจะเผาทุกสิ่งที่ขวางหน้า', image: unsplash('1593640495253-23196b27a87f', 500) },
      { name: 'Selene Moonshadow', role: 'Support', quote: 'แสงจันทร์นำทางผู้กล้า', image: unsplash('1616588589676-62b3bd4ff6d2', 500) },
      { name: 'Grommash', role: 'Tank', quote: 'ไม่มีใครผ่านข้าไปได้', image: unsplash('1593305841991-05c297ba4575', 500) },
      { name: 'Vex the Swift', role: 'Assassin', quote: 'เห็นข้าอีกทีก็สายไปแล้ว', image: unsplash('1550745165-9bc0b252726f', 500) },
    ],
    maps: [
      { name: 'Arena of Champions', description: 'สมรภูมิมาตรฐานสำหรับการแข่งขันอันดับ', image: unsplash('1542751371-adc38448a05e', 700) },
      { name: 'Shattered Peaks', description: 'แผนที่ภูเขาสูงพร้อมจุดซุ่มโจมตีเชิงกลยุทธ์', image: unsplash('1511512578047-dfb367046420', 700) },
      { name: 'Twilight Bastion', description: 'ป้อมปราการโบราณกลางหมอกยามพลบค่ำ', image: unsplash('1538481199705-c710c4e965fc', 700) },
    ],
  },
  val: {
    code: 'val',
    slug: 'valorant',
    name: 'VALORANT',
    subtitle: 'Tactical Shooter',
    tagline: 'Precision Tactical Shooter on PC',
    description: 'Tactical Shooter ระดับโลกจาก Riot Games ผสมผสานทักษะและกลยุทธ์',
    lore: 'ในอนาคตอันใกล้ เทคโนโลยีลึกลับที่เรียกว่า "Radianite" ได้เปลี่ยนโฉมหน้าสงครามไปตลอดกาล หน่วยปฏิบัติการพิเศษจากทั่วโลกถูกคัดเลือกเข้าร่วมภารกิจลับเพื่อปกป้องและแย่งชิงทรัพยากรนี้ ทุกนัดคือการประลองสมองและจังหวะที่ไร้ที่ติ',
    bg: 'linear-gradient(135deg, #1a0505 0%, #2d0a0a 50%, #0a0a1a 100%)',
    bannerImage: unsplash('1593305841991-05c297ba4575', 1600),
    accent: '#ff4655',
    emoji: '🎯',
    players: '25M+',
    genre: 'FPS',
    platform: 'PC',
    characters: [
      { name: 'Raze Ember', role: 'Duelist', quote: 'บึ้ม! จบเกมไว ไวเข้าไว้', image: unsplash('1493711662062-fa541adb3fc8', 500) },
      { name: 'Vera Stillwater', role: 'Sentinel', quote: 'ไม่มีใครผ่านแนวรับของฉันไปได้', image: unsplash('1560419015-7c9196d99832', 500) },
      { name: 'Nomad', role: 'Initiator', quote: 'เปิดทางให้ทีม แล้วตามเก็บ', image: unsplash('1542751110-97427bbecf20', 500) },
      { name: 'Cipher', role: 'Controller', quote: 'ควบคุมพื้นที่ ควบคุมเกม', image: unsplash('1535223289827-a525f6dee96e', 500) },
    ],
    maps: [
      { name: 'Ascent', description: 'แผนที่คลาสสิกกลางเมืองอิตาลี 2 จุดวางระเบิด', image: unsplash('1527814050087-3793815479db', 700) },
      { name: 'Bind', description: 'แผนที่ทะเลทรายพร้อมทางเทเลพอร์ตลับ', image: unsplash('1593640495253-23196b27a87f', 700) },
      { name: 'Haven', description: 'แผนที่เดียวที่มี 3 จุดวางระเบิด', image: unsplash('1616588589676-62b3bd4ff6d2', 700) },
    ],
  },
};

export const GAMES_LIST: GameInfo[] = Object.values(GAMES);

export function getGameBySlug(slug: string): GameInfo | undefined {
  return GAMES_LIST.find((g) => g.slug === slug);
}
