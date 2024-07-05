import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { PageLoading } from '../PageLoading';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { TokenManager } from './tokenManager';
import { useCurrentUser } from '@local/api-generated';
import { Path } from './paths';

export function AuthLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tokenManager = TokenManager.getInstance();
  const { error, isLoading } = useCurrentUser(!tokenManager.getToken(), 1);

  useEffect(() => {
    if (!tokenManager.getToken() || error) {
      tokenManager.setToken();
      queryClient.clear();
      navigate(Path.login);
    }
  }, [location.pathname, error, navigate, queryClient, tokenManager]);

  if (isLoading) {
    return <PageLoading />;
  }

  return <Outlet />;
}
