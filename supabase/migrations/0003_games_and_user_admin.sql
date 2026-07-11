-- Adds admin-manageable game content (banner/tagline/lore/heroes/maps for the 3 games)
-- and lets admins change other users' roles from the admin panel.

-- ============================================================================
-- games: admin-editable marketing content per game (banner, lore, heroes, maps).
-- Structural identity (slug, name, accent color, etc.) stays static in lib/games.ts
-- since it's tied to routing/design, not editorial content.
-- ============================================================================
create table games (
  code             game_code primary key,
  tagline          text not null default '',
  description      text not null default '',
  lore             text not null default '',
  banner_image_url text not null default '',
  players          text not null default '',
  genre            text not null default '',
  platform         text not null default '',
  characters       jsonb not null default '[]'::jsonb,
  maps             jsonb not null default '[]'::jsonb,
  updated_at       timestamptz not null default now()
);

alter table games enable row level security;
create policy games_select_all on games for select using (true);
create policy games_admin_write on games for all
  using ((select role from profiles where id = auth.uid()) = 'admin')
  with check ((select role from profiles where id = auth.uid()) = 'admin');

-- Seed with the content that used to be hardcoded in lib/games.ts, so the
-- games pages render identically right after this migration runs.
insert into games (code, tagline, description, lore, banner_image_url, players, genre, platform, characters, maps) values
(
  'mol',
  'Real-Time 5v5 MOBA on Mobile',
  'แบทเทิลโรแยลสุดมันส์กับเพื่อน 5v5 MOBA บนมือถือที่ยิ่งใหญ่ที่สุดในเอเชีย',
  'ในดินแดนแห่ง Aetheris ทวีปที่ถูกแบ่งแยกด้วยเวทมนตร์โบราณ เหล่านักรบผู้กล้าจากทุกมุมโลกต่างถูกเรียกตัวเข้าสู่สมรภูมิ Land of Dawn เพื่อพิสูจน์ฝีมือและปกป้องแกนพลังงานศักดิ์สิทธิ์ที่หล่อเลี้ยงทั้งทวีป การต่อสู้ครั้งนี้ไม่ใช่แค่เรื่องของชัยชนะ แต่คือชะตากรรมของทั้งโลก',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=75&auto=format&fit=crop',
  '500M+', 'MOBA', 'Mobile',
  '[
    {"name":"Kael Frostwind","role":"Assassin","quote":"ความเร็วคือดาบที่คมที่สุด","image":"https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500&q=75&auto=format&fit=crop"},
    {"name":"Thara Voss","role":"Mage","quote":"เวทมนตร์ไม่เคยโกหก","image":"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=500&q=75&auto=format&fit=crop"},
    {"name":"Brakka","role":"Tank","quote":"ยืนหยัดเพื่อทีมของข้า","image":"https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500&q=75&auto=format&fit=crop"},
    {"name":"Nyx Shadowblade","role":"Marksman","quote":"เป้าหมายเดียว จบในนัดเดียว","image":"https://images.unsplash.com/photo-1560419015-7c9196d99832?w=500&q=75&auto=format&fit=crop"}
  ]'::jsonb,
  '[
    {"name":"Land of Dawn","description":"สมรภูมิมาตรฐาน 3 เลน สำหรับการแข่งขัน 5v5","image":"https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=700&q=75&auto=format&fit=crop"},
    {"name":"Twilight Ruins","description":"แผนที่พิเศษในโหมดอีเวนต์ฤดูกาลใหม่","image":"https://images.unsplash.com/photo-1542751110-97427bbecf20?w=700&q=75&auto=format&fit=crop"},
    {"name":"Frozen Sanctum","description":"สนามน้ำแข็งสุดหฤโหด ทัศนวิสัยจำกัด","image":"https://images.unsplash.com/photo-1535223289827-a525f6dee96e?w=700&q=75&auto=format&fit=crop"}
  ]'::jsonb
),
(
  'aov',
  'Real-Time 5v5 MOBA on Mobile',
  'MOBA เกมยอดฮิตบนมือถือจาก Garena พร้อมการแข่งขันระดับโลก',
  'อาณาจักร Valoria เคยรุ่งเรืองด้วยพลังคริสตัลศักดิ์สิทธิ์ จนกระทั่งสงครามครั้งใหญ่ทำลายสมดุลของโลก บัดนี้เหล่าฮีโร่จากทุกยุคสมัยถูกเรียกกลับมาสู่สมรภูมิ Arena เพื่อชิงชัยและกอบกู้อาณาจักรที่แตกสลาย ทุกการต่อสู้คือหน้าประวัติศาสตร์บทใหม่ของ Valoria',
  'https://images.unsplash.com/photo-1527814050087-3793815479db?w=1600&q=75&auto=format&fit=crop',
  '200M+', 'MOBA', 'Mobile',
  '[
    {"name":"Ignis Warbringer","role":"Fighter","quote":"ไฟจะเผาทุกสิ่งที่ขวางหน้า","image":"https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=500&q=75&auto=format&fit=crop"},
    {"name":"Selene Moonshadow","role":"Support","quote":"แสงจันทร์นำทางผู้กล้า","image":"https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=500&q=75&auto=format&fit=crop"},
    {"name":"Grommash","role":"Tank","quote":"ไม่มีใครผ่านข้าไปได้","image":"https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=75&auto=format&fit=crop"},
    {"name":"Vex the Swift","role":"Assassin","quote":"เห็นข้าอีกทีก็สายไปแล้ว","image":"https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&q=75&auto=format&fit=crop"}
  ]'::jsonb,
  '[
    {"name":"Arena of Champions","description":"สมรภูมิมาตรฐานสำหรับการแข่งขันอันดับ","image":"https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&q=75&auto=format&fit=crop"},
    {"name":"Shattered Peaks","description":"แผนที่ภูเขาสูงพร้อมจุดซุ่มโจมตีเชิงกลยุทธ์","image":"https://images.unsplash.com/photo-1511512578047-dfb367046420?w=700&q=75&auto=format&fit=crop"},
    {"name":"Twilight Bastion","description":"ป้อมปราการโบราณกลางหมอกยามพลบค่ำ","image":"https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=700&q=75&auto=format&fit=crop"}
  ]'::jsonb
),
(
  'val',
  'Precision Tactical Shooter on PC',
  'Tactical Shooter ระดับโลกจาก Riot Games ผสมผสานทักษะและกลยุทธ์',
  'ในอนาคตอันใกล้ เทคโนโลยีลึกลับที่เรียกว่า "Radianite" ได้เปลี่ยนโฉมหน้าสงครามไปตลอดกาล หน่วยปฏิบัติการพิเศษจากทั่วโลกถูกคัดเลือกเข้าร่วมภารกิจลับเพื่อปกป้องและแย่งชิงทรัพยากรนี้ ทุกนัดคือการประลองสมองและจังหวะที่ไร้ที่ติ',
  'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=1600&q=75&auto=format&fit=crop',
  '25M+', 'FPS', 'PC',
  '[
    {"name":"Raze Ember","role":"Duelist","quote":"บึ้ม! จบเกมไว ไวเข้าไว้","image":"https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=500&q=75&auto=format&fit=crop"},
    {"name":"Vera Stillwater","role":"Sentinel","quote":"ไม่มีใครผ่านแนวรับของฉันไปได้","image":"https://images.unsplash.com/photo-1560419015-7c9196d99832?w=500&q=75&auto=format&fit=crop"},
    {"name":"Nomad","role":"Initiator","quote":"เปิดทางให้ทีม แล้วตามเก็บ","image":"https://images.unsplash.com/photo-1542751110-97427bbecf20?w=500&q=75&auto=format&fit=crop"},
    {"name":"Cipher","role":"Controller","quote":"ควบคุมพื้นที่ ควบคุมเกม","image":"https://images.unsplash.com/photo-1535223289827-a525f6dee96e?w=500&q=75&auto=format&fit=crop"}
  ]'::jsonb,
  '[
    {"name":"Ascent","description":"แผนที่คลาสสิกกลางเมืองอิตาลี 2 จุดวางระเบิด","image":"https://images.unsplash.com/photo-1527814050087-3793815479db?w=700&q=75&auto=format&fit=crop"},
    {"name":"Bind","description":"แผนที่ทะเลทรายพร้อมทางเทเลพอร์ตลับ","image":"https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=700&q=75&auto=format&fit=crop"},
    {"name":"Haven","description":"แผนที่เดียวที่มี 3 จุดวางระเบิด","image":"https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=700&q=75&auto=format&fit=crop"}
  ]'::jsonb
)
on conflict (code) do nothing;

-- ============================================================================
-- Let admins change any user's role from the admin panel.
-- profiles_update_self only allows auth.uid() = id, which blocks admin-on-other
-- updates even though prevent_role_escalation() already permits them.
-- ============================================================================
create policy profiles_update_admin on profiles for update
  using ((select role from profiles where id = auth.uid()) = 'admin');
