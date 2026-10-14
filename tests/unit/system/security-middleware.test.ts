import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import securityMiddleware from '@/server/middleware/security'
import rateLimitMiddleware from '@/server/middleware/rate-limit'
import {
  getRateLimitKey,
  isRequestOriginAllowed,
} from '@/server/shared/utils/security'
import { createTestEvent } from '@/tests/helpers/h3-event'

beforeEach(() => {
  vi.stubGlobal('useRuntimeConfig', () => ({
    security: {
      allowedOrigins: 'https://trusted.example.test',
      maxRequestBodyBytes: 100,
      apiRateLimit: 2,
      apiRateLimitWindowMs: 1000,
    },
  }))
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('HTTP origin protection', () => {
  it.each([
    { headers: {}, allowed: true },
    { headers: { origin: 'http://unit.example.test' }, allowed: true },
    { headers: { origin: 'https://trusted.example.test' }, allowed: true },
    { headers: { origin: 'https://foreign.example.test' }, allowed: false },
    { headers: { origin: 'invalid' }, allowed: false },
    { headers: { 'sec-fetch-site': 'cross-site' }, allowed: false },
  ])('checks $headers', ({ headers, allowed }) => {
    expect(
      isRequestOriginAllowed(
        createTestEvent('/api/test', 'POST', headers),
        new Set(['https://trusted.example.test']),
      ),
    ).toBe(allowed)
  })

  it('applies hardening headers to pages and avoids caching API responses', () => {
    const page = createTestEvent('/dashboard')
    securityMiddleware(page)
    expect(page.node.res.getHeader('x-content-type-options')).toBe('nosniff')
    expect(page.node.res.getHeader('content-security-policy')).toContain(
      "frame-ancestors 'none'",
    )
    const api = createTestEvent()
    securityMiddleware(api)
    expect(api.node.res.getHeader('cache-control')).toBe('no-store')
  })

  it('rejects cross-site writes and accepts same-origin writes', () => {
    expect(() =>
      securityMiddleware(
        createTestEvent('/api/test', 'POST', {
          origin: 'https://foreign.example.test',
        }),
      ),
    ).toThrow(expect.objectContaining({ statusCode: 403 }))
    expect(() =>
      securityMiddleware(
        createTestEvent('/api/test', 'PATCH', {
          origin: 'http://unit.example.test',
          'content-length': '100',
        }),
      ),
    ).not.toThrow()
  })

  it.each(['101', '-1', '1.5', 'invalid', 'Infinity'])(
    'rejects unsafe request lengths %s',
    (length) => {
      expect(() =>
        securityMiddleware(
          createTestEvent('/api/test', 'POST', { 'content-length': length }),
        ),
      ).toThrow(expect.objectContaining({ statusCode: 413 }))
    },
  )
})

describe('API rate limit middleware', () => {
  it('ignores pages, rejects over-limit requests, and resets expired windows', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2030-01-01T00:00:00Z'))
    const page = createTestEvent('/dashboard')
    rateLimitMiddleware(page)
    expect(page.node.res.getHeader('ratelimit-limit')).toBeUndefined()
    const first = createTestEvent()
    expect(getRateLimitKey(first)).toBe('unknown-client')
    rateLimitMiddleware(first)
    expect(first.node.res.getHeader('ratelimit-remaining')).toBe('1')
    rateLimitMiddleware(createTestEvent())
    const denied = createTestEvent()
    expect(() => rateLimitMiddleware(denied)).toThrow(
      expect.objectContaining({ statusCode: 429 }),
    )
    expect(denied.node.res.getHeader('retry-after')).toBe('1')
    vi.advanceTimersByTime(60_000)
    expect(() => rateLimitMiddleware(createTestEvent())).not.toThrow()
  })
})
