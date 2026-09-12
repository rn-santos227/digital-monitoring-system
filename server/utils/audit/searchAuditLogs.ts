import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { AuditLogSearchRequest } from '../../shared/requests'
import { AUDIT_LOG_LIST_SELECT_COLUMNS } from '../../shared/constants'
import { applyAuditAdvancedSearch } from './applyAuditAdvancedSearch'
import { buildAuditLegacySearchExpressions } from './buildAuditLegacySearchExpressions'

interface SearchAuditLogsParams {
  supabase: SupabaseClient
  search: AuditLogSearchRequest
  rangeFrom: number
  rangeTo: number
}

export const searchAuditLogs = async (params: SearchAuditLogsParams) => {
  const { supabase, search, rangeFrom, rangeTo } = params
  const legacyExpressions = buildAuditLegacySearchExpressions(search.term, search.fields)
  let query = supabase
    .from('audit_logs')
    .select(AUDIT_LOG_LIST_SELECT_COLUMNS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(rangeFrom, rangeTo)
    
  if (legacyExpressions.length > 0) {
    query = query.or(legacyExpressions.join(','))
  }
  if (search.userName) {
    query = query.ilike('user_profiles.full_name', `%${search.userName}%`)
  }
  if (search.startDate) {
    query = query.gte('created_at', search.startDate)
  }
  if (search.endDate) {
    query = query.lte('created_at', search.endDate)
  }
  if (search.conditions.length > 0) {
    query = applyAuditAdvancedSearch(query, search.conditions, search.match)
  }

  const { data, count, error } = await query
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to search audit logs: ${error.message}` })
  }

  return { rows: data ?? [], totalItems: count ?? 0 }
}
