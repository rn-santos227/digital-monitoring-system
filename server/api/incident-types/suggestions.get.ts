import { defineEventHandler, getQuery } from 'h3'
import type { IncidentTypeSuggestionResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchIncidentTypeSuggestions } from '../../utils/incidents/fetchIncidentTypeSuggestions'


