import {
  AuthService,
  TokenObtainPair,
  TokenRefresh,
} from '@local/api-generated';
import { useMutation } from '@tanstack/react-query';
import { tokenManager } from './tokenManager';

export const useLogin = () => {
  const login = useMutation({
    mutationFn: (data: TokenObtainPair) => AuthService.authTokenCreate(data),
  });

  const performLogin = (
    values: any,
    onSuccess: (data: TokenRefresh) => void
  ) => {
    login.mutate(values, {
      onSuccess: (data) => {
        const token = (data as unknown as TokenRefresh).access || '';
        tokenManager.setToken(token);
        onSuccess(data as unknown as TokenRefresh);
      },
    });
  };

  return { ...login, performLogin };
};
