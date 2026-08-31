export const SECURITY_HEADERS = Object.freeze({
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-Permitted-Cross-Domain-Policies': 'none',
} as const)

export const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "base-uri 'self'",
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob: https:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "connect-src 'self' https: wss:",
  "worker-src 'self' blob:",
  'upgrade-insecure-requests',
].join('; ')

export const API_PATH_PREFIX = '/api/'
export const DEFAULT_API_RATE_LIMIT = 120
export const DEFAULT_API_RATE_LIMIT_WINDOW_MS = 60_000
export const DEFAULT_MAX_REQUEST_BODY_BYTES = 11_534_336
export const MUTATING_HTTP_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])
export const RATE_LIMIT_CLEANUP_INTERVAL_MS = 60_000
