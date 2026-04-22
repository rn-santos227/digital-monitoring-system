import { createError, defineEventHandler, getQuery } from 'h3'
import type { BattalionSuggestionsResponse } from '../../shared/responses'
import { BATTALION_SUGGESTION_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapBattalionSuggestionItem, parseUnitSuggestionQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'


