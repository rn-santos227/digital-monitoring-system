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
