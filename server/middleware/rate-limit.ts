import { createError, defineEventHandler, getRequestURL, setResponseHeaders } from 'h3'

import {
  API_PATH_PREFIX,
  DEFAULT_API_RATE_LIMIT,
  DEFAULT_API_RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_CLEANUP_INTERVAL_MS,
} from '../shared/constants'
import {
  consumeRateLimit,
  getRateLimitKey,
  parsePositiveInteger,
  removeExpiredRateLimits,
  type RateLimitEntry,
} from '../shared/utils'

const rateLimits = new Map<string, RateLimitEntry>()
let nextCleanupAt = 0

export default defineEventHandler((event) => {
  if (!getRequestURL(event).pathname.startsWith(API_PATH_PREFIX)) {
    return
  }

  const now = Date.now()
  if (now >= nextCleanupAt) {
    removeExpiredRateLimits(rateLimits, now)
    nextCleanupAt = now + RATE_LIMIT_CLEANUP_INTERVAL_MS
  }

  const config = useRuntimeConfig(event).security
  const limit = parsePositiveInteger(config.apiRateLimit, DEFAULT_API_RATE_LIMIT)
  const windowMs = parsePositiveInteger(config.apiRateLimitWindowMs, DEFAULT_API_RATE_LIMIT_WINDOW_MS)
  const entry = consumeRateLimit(rateLimits, getRateLimitKey(event), now, limit, windowMs)
  const remaining = Math.max(0, limit - entry.count)
  const resetSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000))

  setResponseHeaders(event, {
    'RateLimit-Limit': String(limit),
    'RateLimit-Remaining': String(remaining),
    'RateLimit-Reset': String(resetSeconds),
  })

  if (entry.count > limit) {
    setResponseHeaders(event, { 'Retry-After': String(resetSeconds) })
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: 'The API request limit has been exceeded. Try again later.',
    })
  }
})
