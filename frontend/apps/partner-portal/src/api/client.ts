import { OpenAPI } from '@local/api-generated';
import { tokenManager } from '@local/shared-components';

export class PortalApiError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`Request failed (${status})`);
  }
}

export async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown } = {}
): Promise<T> {
  const token = tokenManager.getToken();
  const response = await fetch(`${OpenAPI.BASE}${path}`, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const text = await response.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!response.ok) throw new PortalApiError(response.status, data);
  return data as T;
}

/** First readable message from a DRF error response. */
export function errorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (!(error instanceof PortalApiError)) return fallback;
  const body = error.body as Record<string, unknown> | null;
  if (!body || typeof body !== 'object') return fallback;
  if (typeof body['detail'] === 'string') return body['detail'];
  for (const value of Object.values(body)) {
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
    if (typeof value === 'string') return value;
  }
  return fallback;
}
