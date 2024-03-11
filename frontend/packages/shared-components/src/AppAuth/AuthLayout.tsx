import { useAuthWatcher } from '@local/api-generated';
import { Outlet } from 'react-router-dom';
import { Path } from './paths';
import { PageLoading } from '../PageLoading';

export function AuthLayout() {
  const { isLoading } = useAuthWatcher();

  if (isLoading) {
    return <PageLoading />;
  }

  return <Outlet />;
}
