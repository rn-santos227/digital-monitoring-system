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

})
