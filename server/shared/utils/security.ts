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
