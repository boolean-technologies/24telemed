import { OpenAPI } from '@/api';
import { request as __request } from '@/api/core/request';

/** Self-sign-up payload for /auth/register/ (post-dates the generated client). */
export type RegisterInput = {
  user_type: 'customer' | 'doctor';
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  specialty?: string;
};

export type RegisterResult = {
  user_type: 'customer' | 'doctor';
  is_verified: boolean;
  access: string;
  refresh: string;
};

export function registerUser(data: RegisterInput) {
  return __request<RegisterResult>(OpenAPI, {
    method: 'POST',
    url: '/auth/register/',
    body: data,
  });
}
