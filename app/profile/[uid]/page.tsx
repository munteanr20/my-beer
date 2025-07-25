import ProfilePage from '../../components/profile/ProfilePage';
import { userService } from '../../services/userService';
import { User } from '../../types';

function serializeUser(user: User | null) {
  if (!user) return null;
  return {
    ...user,
    createdAt: (user.createdAt && typeof user.createdAt.toDate === 'function') ? user.createdAt.toDate().toISOString() : user.createdAt,
    updatedAt: (user.updatedAt && typeof user.updatedAt.toDate === 'function') ? user.updatedAt.toDate().toISOString() : user.updatedAt,
  };
}

export default async function UserProfilePage(
  { params }: { params: Promise<{ uid: string }> }
) {
  const { uid } = await params;
  const userData = await userService.getUser(uid);
  return <ProfilePage userData={serializeUser(userData)} />;
} 