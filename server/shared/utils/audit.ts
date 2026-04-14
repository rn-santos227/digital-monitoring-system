import type { AuditLogActorDetail, AuditLogDetail, AuditLogListItem } from '../models'
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '../constants'
import { parseNumber } from './parsers'


interface AuditLogActorRow {
  id?: string | null
  full_name?: string | null
  email?: string | null
  avatar_url?: string | null
  is_active?: boolean | null
}

interface AuditLogListRow {
  id: string
  action: string
  table_name: string
  record_id: string | null
  created_at: string
  user: AuditLogActorRow | AuditLogActorRow[] | null
}

interface AuditLogDetailRow {
  id: string
  user_id: string | null
  action: string
  table_name: string
  record_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  created_at: string
  user: AuditLogActorRow | AuditLogActorRow[] | null
}

