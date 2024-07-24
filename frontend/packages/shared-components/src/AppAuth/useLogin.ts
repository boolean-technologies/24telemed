import {
  AuthService,
  DoctorTokenObtainPair,
  PersonnelTokenObtainPair,
  TokenRefresh,
} from '@local/api-generated';
import { useMutation } from '@tanstack/react-query';
import { tokenManager } from './tokenManager';

export const useDoctorLogin = () => {
  const doctorLogin = useMutation({
    mutationFn: (data: DoctorTokenObtainPair) => AuthService.authTokenDoctorCreate(data),
  });

  const performLogin = (
    values: any,
    onSuccess: (data: TokenRefresh) => void
  ) => {
    doctorLogin.mutate(values, {
      onSuccess: (data) => {
        const token = (data as unknown as TokenRefresh).access || '';
        tokenManager.setToken(token);
        onSuccess(data as unknown as TokenRefresh);
      },
    });
  };

  return { ...doctorLogin, performLogin };
};


export const usePersonnelLogin = () => {
  const personnelLogin = useMutation({
    mutationFn: (data: PersonnelTokenObtainPair) => AuthService.authTokenPersonnelCreate(data),
  });

  const performLogin = (
    values: any,
    onSuccess: (data: TokenRefresh) => void
  ) => {
    personnelLogin.mutate(values, {
      onSuccess: (data) => {
        const token = (data as unknown as TokenRefresh).access || '';
        tokenManager.setToken(token);
        onSuccess(data as unknown as TokenRefresh);
      },
    });
  };

  return { ...personnelLogin, performLogin };
}