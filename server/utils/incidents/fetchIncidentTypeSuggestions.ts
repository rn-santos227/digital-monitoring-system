import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import {
  INCIDENT_SUGGESTION_PAGE_SIZE,
  INCIDENT_TYPE_SUGGESTION_SELECT_COLUMNS,
} from '../../shared/constants'
import type { IncidentTypeSuggestionItem } from '../../shared/models'


