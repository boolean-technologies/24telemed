import { Outlet } from 'react-router-dom';
import { PageLoading } from '../PageLoading';
import { useAuthWatcher } from './useAuthWatcher';

export function AuthLayout() {
  const { isLoading } = useAuthWatcher();

  if (isLoading) {
    return <PageLoading />;
  }

  return <Outlet />;
}
