import { useMutation } from '@tanstack/react-query';
import { AuthService, TokenObtainPair } from '@local/api-generated';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: TokenObtainPair) => AuthService.authTokenCreate(data),
  });
};
