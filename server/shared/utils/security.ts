import type { H3Event } from 'h3'
import { getHeader, getRequestIP, getRequestURL } from 'h3'

export interface RateLimitEntry {
  count: number
  resetAt: number
}

export function parsePositiveInteger(value: unknown, fallback: number): number {
  const parsed = typeof value === 'number' ? value : Number(value)

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback
}

export function parseAllowedOrigins(value: unknown): ReadonlySet<string> {
  const origins = typeof value === 'string' ? value.split(',') : []

  return new Set(origins.map(normalizeOrigin).filter((origin): origin is string => Boolean(origin)))
}

export function normalizeOrigin(value: string): string | undefined {
  try {
    const url = new URL(value.trim())

    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      return undefined
    }

    return url.origin
  } catch {
    return undefined
  }
}

export function isRequestOriginAllowed(event: H3Event, allowedOrigins: ReadonlySet<string>): boolean {
  const fetchSite = getHeader(event, 'sec-fetch-site')?.toLowerCase()

  if (fetchSite === 'cross-site') {
    return false
  }

  const originHeader = getHeader(event, 'origin')
  if (!originHeader) {
    return true
  }

  const origin = normalizeOrigin(originHeader)
  if (!origin) {
    return false
  }

  return origin === getRequestURL(event).origin || allowedOrigins.has(origin)
}

export function getRateLimitKey(event: H3Event): string {
  // Do not trust a caller-controlled X-Forwarded-For value. A trusted reverse
  // proxy should overwrite the socket address before forwarding the request.
  return getRequestIP(event) ?? 'unknown-client'
}

export function consumeRateLimit(
  entries: Map<string, RateLimitEntry>,
  key: string,
  now: number,
  limit: number,
  windowMs: number,
): RateLimitEntry {
  const existing = entries.get(key)
  const entry = !existing || existing.resetAt <= now
    ? { count: 1, resetAt: now + windowMs }
    : { count: existing.count + 1, resetAt: existing.resetAt }

  entries.set(key, entry)
  return entry
}

export function removeExpiredRateLimits(entries: Map<string, RateLimitEntry>, now: number): void {
  for (const [key, entry] of entries) {
    if (entry.resetAt <= now) {
      entries.delete(key)
    }
  }
}
