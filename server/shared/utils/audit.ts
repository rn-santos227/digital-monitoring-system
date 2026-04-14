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

const toActor = (actor: AuditLogActorRow | AuditLogActorRow[] | null): AuditLogActorRow | null => {
  if (!actor) {
    return null
  }

  if (Array.isArray(actor)) {
    return actor[0] ?? null
  }

  return actor
}

export const parsePaginationQuery = (query: { page?: unknown; pageSize?: unknown }) => {
  const rawPage = Math.trunc(parseNumber(query.page, DEFAULT_PAGE))
  const rawPageSize = Math.trunc(parseNumber(query.pageSize, DEFAULT_PAGE_SIZE))

  const page = Math.max(rawPage, DEFAULT_PAGE)
  const pageSize = Math.min(Math.max(rawPageSize, 1), MAX_PAGE_SIZE)
  const rangeFrom = (page - 1) * pageSize
  const rangeTo = rangeFrom + pageSize - 1

  return {
    page,
    pageSize,
    rangeFrom,
    rangeTo,
  }
}
