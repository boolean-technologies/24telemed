import { useAuthWatcher } from '@local/api-generated';
import { Outlet } from 'react-router-dom';
import { Path } from './paths';
import { PageLoading } from '../PageLoading';

export function AuthLayout() {
  const { isPending } = useAuthWatcher([Path.login], Path.login, Path.home);

  if (isPending) {
    return <PageLoading />;
  }

  return <Outlet />;
}
