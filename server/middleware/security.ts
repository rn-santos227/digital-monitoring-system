import {
  createError,
  defineEventHandler,
  getHeader,
  getMethod,
  getRequestURL,
  setResponseHeader,
  setResponseHeaders,
} from 'h3'

import {
  API_PATH_PREFIX,
  CONTENT_SECURITY_POLICY,
  DEFAULT_MAX_REQUEST_BODY_BYTES,
  MUTATING_HTTP_METHODS,
  SECURITY_HEADERS,
} from '../shared/constants'
import {
  isRequestOriginAllowed,
  parseAllowedOrigins,
  parsePositiveInteger,
} from '../shared/utils'

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event)
  const securityConfig = config.security
  const requestUrl = getRequestURL(event)

  setResponseHeaders(event, SECURITY_HEADERS)
  setResponseHeader(event, 'Content-Security-Policy', CONTENT_SECURITY_POLICY)
  setResponseHeader(event, 'Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
})
