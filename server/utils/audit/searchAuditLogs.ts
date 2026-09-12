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

