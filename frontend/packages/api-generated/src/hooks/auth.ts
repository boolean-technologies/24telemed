import { useMutation } from '@tanstack/react-query';
import {
  AuthService,
  OpenAPI,
  TokenObtainPair,
  TokenRefresh,
  UsersService,
} from '../api';
import { TOKEN_KEY } from '../constants';

type LoginType = {
  username: string;
  password: string;
};

export const useLogin = () => {
  const login = useMutation({
    mutationFn: (data: TokenObtainPair) => AuthService.authTokenCreate(data),
  });

  const performLogin = (
    values: LoginType,
    onSuccess: (data: TokenRefresh) => void
  ) => {
    login.mutate(values, {
      onSuccess: (data) => {
        const token = (data as unknown as TokenRefresh).access || '';
        localStorage.setItem(TOKEN_KEY, token);
        OpenAPI.TOKEN = token;
        onSuccess(data as unknown as TokenRefresh);
      },
    });
  };

  return { ...login, performLogin };
};

export const useChangePassword = () => {
  const changePassword = useMutation({
    mutationFn: ({
      current_password,
      new_password,
    }: {
      current_password: string;
      new_password: string;
    }) =>
      UsersService.usersChangePassword({
        current_password,
        new_password,
      }),
  });
  return changePassword;
};

export const useForgotPassword = () => {
  const forgotPassword = useMutation({
    mutationFn: (identifier: string) =>
      UsersService.usersForgetPassword({ identifier }),
  });
  return forgotPassword;
};

export const useResetPassword = () => {
  const resetPassword = useMutation({
    mutationFn: (new_password: string) =>
      UsersService.usersPasswordResetChange({ new_password }),
  });
  return resetPassword;
};
