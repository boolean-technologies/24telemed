import { API_BASE_URL } from '@/config/api';

async function post<T>(path: string, body: object, method = 'POST'): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const detail = Array.isArray(data.detail)
      ? data.detail.join(' ')
      : data.detail;
    throw new Error(detail || 'Something went wrong. Please try again.');
  }
  return data as T;
}

export function requestPasswordReset(identifier: string) {
  return post<{ detail: string; reset_id: string }>(
    '/users/forget_password/',
    { identifier }
  );
}

export function verifyPasswordResetOtp(resetId: string, otp: string) {
  return post<{ reset_id: string; reset_token: string }>(
    '/users/otp_validation/',
    { reset_id: resetId, otp }
  );
}

export function changeForgottenPassword(
  resetId: string,
  resetToken: string,
  newPassword: string
) {
  return post<{ detail: string }>(
    '/users/password_reset_change/',
    {
      reset_id: resetId,
      reset_token: resetToken,
      new_password: newPassword,
    },
    'PUT'
  );
}
