import { Platform } from 'react-native';
import { API_BASE_URL } from '@/config/api';
import { getAccessToken } from '@/auth/storage';

type UploadAsset = {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
};

export async function uploadProfilePhoto(asset: UploadAsset) {
  const token = await getAccessToken();
  const form = new FormData();
  form.append(
    'file',
    {
      uri: asset.uri,
      name: asset.fileName || `profile-${Date.now()}.jpg`,
      type: asset.mimeType || 'image/jpeg',
    } as unknown as Blob
  );

  const response = await fetch(`${API_BASE_URL}/users/profile_photo/`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.detail || 'Could not upload the profile photo.');
  }
  return body;
}
