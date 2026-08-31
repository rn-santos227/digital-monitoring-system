import type { H3Event } from 'h3'
import { getHeader, getRequestIP, getRequestURL } from 'h3'

export interface RateLimitEntry {
  count: number
  resetAt: number
}
