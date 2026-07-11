import { notFound } from 'next/navigation';
import { getGameContentForAdmin } from '@/lib/supabase/queries/games';
import type { GameCode } from '@/lib/games';
import GameContentForm from '../../GameContentForm';
import { updateGameContent } from '../../actions';

const VALID_CODES: GameCode[] = ['aov', 'mol', 'val'];

export default async function EditGamePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  if (!VALID_CODES.includes(code as GameCode)) notFound();

  const game = await getGameContentForAdmin(code as GameCode);

  return (
    <div>
      <h1 className="text-xl font-medium mb-6" style={{ color: 'var(--text-primary)' }}>แก้ไข {game.name}</h1>
      <div className="card p-6">
        <GameContentForm action={updateGameContent} game={game} />
      </div>
    </div>
  );
}
