import { getCurrentUser } from '@/lib/dal';
import NavbarClient from './NavbarClient';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <NavbarClient
      user={
        user
          ? { username: user.username, displayName: user.displayName, avatarUrl: user.avatarUrl, role: user.role }
          : null
      }
    />
  );
}
