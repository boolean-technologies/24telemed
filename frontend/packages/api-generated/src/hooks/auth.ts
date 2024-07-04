import { useMutation } from '@tanstack/react-query';
import { UsersService } from '../api';

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
