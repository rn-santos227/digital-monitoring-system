import { createError, defineEventHandler, getRequestURL, setResponseHeaders } from 'h3'

import {
  API_PATH_PREFIX,
  DEFAULT_API_RATE_LIMIT,
  DEFAULT_API_RATE_LIMIT_WINDOW_MS,
  RATE_LIMIT_CLEANUP_INTERVAL_MS,
} from '../shared/constants'