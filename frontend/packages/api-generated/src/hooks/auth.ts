import { useMutation } from '@tanstack/react-query';
import { AuthService, TokenObtainPair, TokenRefresh } from '../api';
import { TOKEN_KEY } from '../../../shared-components/src/constants';

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
        localStorage.setItem(
          TOKEN_KEY,
          (data as unknown as TokenRefresh).access || ''
        );
        onSuccess(data as unknown as TokenRefresh);
      },
    });
  };

  return { ...login, performLogin }
};
