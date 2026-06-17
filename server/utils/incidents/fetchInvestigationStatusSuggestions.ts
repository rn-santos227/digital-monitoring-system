import type { SupabaseClient } from '@supabase/supabase-js'
import { createError } from 'h3'
import {
  INCIDENT_SUGGESTION_PAGE_SIZE,
  INVESTIGATION_STATUS_SUGGESTION_SELECT_COLUMNS,
} from '../../shared/constants'
import type { InvestigationStatusSuggestionItem } from '../../shared/models'

export const fetchInvestigationStatusSuggestions = async (
  supabase: SupabaseClient,
  term: string,
): Promise<InvestigationStatusSuggestionItem[]> => {
  let query = supabase
    .from('investigation_statuses')
    .select(INVESTIGATION_STATUS_SUGGESTION_SELECT_COLUMNS)


}
