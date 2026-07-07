import { ApiError } from './core/ApiError';

const CONNECTION_MESSAGE =
  'Cannot reach the server. Please check your internet connection and try again.';

/** Friendly fallbacks per HTTP status when the server sends no useful body. */
const STATUS_DEFAULTS: Record<number, string> = {
  400: 'Some of the details were invalid. Please check them and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You do not have permission to do that.',
  404: 'We could not find what you were looking for.',
  408: 'The request timed out. Please try again.',
  409: 'That conflicts with something else. Please refresh and try again.',
  413: 'That file is too large.',
  429: 'Too many attempts. Please wait a moment and try again.',
  500: 'The server ran into a problem. Please try again shortly.',
  502: 'The server is unavailable right now. Please try again shortly.',
  503: 'The server is unavailable right now. Please try again shortly.',
};

function looksLikeNetworkError(message: string): boolean {
  return /network request failed|failed to fetch|timeout|timed out|econn|network error/i.test(
    message
  );
}

/** Pull the most specific human message out of a DRF-style error body. */
function extractDetail(body: unknown): string | null {
  if (!body) return null;
  if (typeof body === 'string') return body.trim() || null;
  if (typeof body !== 'object') return null;

  const record = body as Record<string, unknown>;
  if (typeof record.detail === 'string' && record.detail.trim()) {
    return record.detail.trim();
  }
  if (
    Array.isArray(record.non_field_errors) &&
    typeof record.non_field_errors[0] === 'string'
  ) {
    return record.non_field_errors[0];
  }
  // First field-level error (e.g. { username: ["already taken"] }).
  for (const value of Object.values(record)) {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (Array.isArray(value) && typeof value[0] === 'string') return value[0];
  }
  return null;
}

type ErrorMessageOptions = {
  /** Used when nothing more specific can be determined. */
  fallback?: string;
  /** Override the message for specific HTTP statuses (e.g. 401 on login). */
  statusMessages?: Record<number, string>;
};

/**
 * Turn any thrown value into a clear, user-facing sentence. Prefers the
 * backend's own `detail`/field errors, falls back to a friendly per-status
 * message, and detects offline/network failures. Use this everywhere an error
 * is shown to the user so messaging stays consistent across the app.
 */
export function getErrorMessage(
  error: unknown,
  options: ErrorMessageOptions = {}
): string {
  const fallback =
    options.fallback ?? 'Something went wrong. Please try again.';

  if (error instanceof ApiError) {
    // status 0 == request never reached the server.
    if (!error.status) return CONNECTION_MESSAGE;
    const override = options.statusMessages?.[error.status];
    if (override) return override;
    return extractDetail(error.body) ?? STATUS_DEFAULTS[error.status] ?? fallback;
  }

  if (error instanceof Error) {
    if (looksLikeNetworkError(error.message)) return CONNECTION_MESSAGE;
    return error.message.trim() || fallback;
  }

  return fallback;
}
