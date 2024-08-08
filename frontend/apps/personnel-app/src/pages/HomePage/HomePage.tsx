import { useCurrentUser } from '@local/api-generated';
import { HomePagePersonnel } from './HomePagePersonnel';
import { HomePageCustomer } from './HomePageCustomer';

export function HomePage() {
  const { data: user } = useCurrentUser();
  if (!user) return null;
  if (user.user_type === 'personnel') return <HomePagePersonnel />;
  return <HomePageCustomer user={user} />;
}
