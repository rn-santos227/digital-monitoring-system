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
  
  if (!requestUrl.pathname.startsWith(API_PATH_PREFIX)) {
    return
  }

  setResponseHeader(event, 'Cache-Control', 'no-store')

  const method = getMethod(event).toUpperCase()
  if (!MUTATING_HTTP_METHODS.has(method)) {
    return
  }


  const allowedOrigins = parseAllowedOrigins(securityConfig.allowedOrigins)
  if (!isRequestOriginAllowed(event, allowedOrigins)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cross-site request rejected',
      message: 'The request origin is not trusted.',
    })
  }

  const contentLengthHeader = getHeader(event, 'content-length')
  const contentLength = contentLengthHeader ? Number(contentLengthHeader) : 0
  const maxBodyBytes = parsePositiveInteger(securityConfig.maxRequestBodyBytes, DEFAULT_MAX_REQUEST_BODY_BYTES)

  if (!Number.isSafeInteger(contentLength) || contentLength < 0 || contentLength > maxBodyBytes) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Payload Too Large',
      message: `Request bodies must not exceed ${maxBodyBytes} bytes.`,
    })
  }
})
