import { describe, expect, it } from 'vitest'

import {
  CONTENT_SECURITY_POLICY,
  SECURITY_HEADERS,
} from '../../../server/shared/constants/lib/security'
import {
  consumeRateLimit,
  normalizeOrigin,
  parseAllowedOrigins,
  parsePositiveInteger,
  removeExpiredRateLimits,
  type RateLimitEntry,
} from '../../../server/shared/utils/security'

describe('OWASP security utilities', () => {
  it('defines browser hardening headers and a restrictive CSP baseline', () => {
    expect(SECURITY_HEADERS['X-Content-Type-Options']).toBe('nosniff')
    expect(SECURITY_HEADERS['X-Frame-Options']).toBe('DENY')
    expect(SECURITY_HEADERS['Referrer-Policy']).toBe('strict-origin-when-cross-origin')
    expect(CONTENT_SECURITY_POLICY).toContain("default-src 'self'")
    expect(CONTENT_SECURITY_POLICY).toContain("frame-ancestors 'none'")
    expect(CONTENT_SECURITY_POLICY).toContain("object-src 'none'")
  })

  it('accepts only canonical HTTP origins from configuration', () => {
    expect(normalizeOrigin('https://monitoring.example.mil')).toBe('https://monitoring.example.mil')
    expect(normalizeOrigin('javascript:alert(1)')).toBeUndefined()
    expect(normalizeOrigin('https://monitoring.example.mil/path')).toBeUndefined()

    expect([...parseAllowedOrigins('https://one.example, invalid, http://localhost:3000')]).toEqual([
      'https://one.example',
      'http://localhost:3000',
    ])
  })

  it('normalizes positive security limits and rejects unsafe values', () => {
    expect(parsePositiveInteger('120', 10)).toBe(120)
    expect(parsePositiveInteger('-1', 10)).toBe(10)
    expect(parsePositiveInteger('1.5', 10)).toBe(10)
    expect(parsePositiveInteger(undefined, 10)).toBe(10)
  })
})
