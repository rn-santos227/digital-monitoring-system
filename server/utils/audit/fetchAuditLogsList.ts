import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { AUDIT_LOG_LIST_SELECT_COLUMNS } from '../../shared/constants'

interface FetchAuditLogsListParams {
  supabase: SupabaseClient
  rangeFrom: number
  rangeTo: number
  userId?: string
}

export async function fetchAuditLogsList(params: FetchAuditLogsListParams) {
  const { supabase, rangeFrom, rangeTo, userId } = params

  let query = supabase
    .from('audit_logs')
    .select(AUDIT_LOG_LIST_SELECT_COLUMNS, { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(rangeFrom, rangeTo)

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, count, error } = await query
  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch audit logs: ${error.message}` })
  }

  return {
    rows: data ?? [],
    totalItems: count ?? 0,
  }
}
