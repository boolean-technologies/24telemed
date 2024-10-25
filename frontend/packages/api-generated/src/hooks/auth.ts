import { useMutation } from '@tanstack/react-query';
import {
  AuthService,
  OpenAPI,
  TokenRefresh,
  UsersService,
} from '../api';
import { TOKEN_KEY } from '../constants';

type LoginType = {
  username: string;
  password: string;
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

export const useOTPValidation = () => {
  const otpValidation = useMutation({
    mutationFn: (data: { otp: string }) => UsersService.usersOtpValidation(data),
  });
  return otpValidation;
}
export const useResetPassword = () => {
  const resetPassword = useMutation({
    mutationFn: (new_password: string) =>
      UsersService.usersPasswordResetChange({ new_password }),
  });
  return resetPassword;
};
