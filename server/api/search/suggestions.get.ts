import { createError, defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { GlobalSearchSuggestionResponse } from '../../shared/responses'
import { parseGlobalSearchSuggestionQuery } from '../../shared/validations'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchGlobalSearchSuggestions } from '../../utils/global-search/fetchGlobalSearchSuggestions'


