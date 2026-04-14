export type UUID = string
export type ISODateTime = string

export interface AuditLog {
  id: UUID
  user_id: UUID | null
  action: string
  table_name: string
  record_id: UUID | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  metadata: Record<string, unknown> | null
  created_at: ISODateTime
}

export interface AuditLogActorSummary {
  fullName: string | null
  email: string | null
}

export interface AuditLogListItem {
  id: string
  action: string
  tableName: string
  recordId: string | null
  createdAt: string
  actor: AuditLogActorSummary | null
}

export interface AuditLogListResponse {
  items: AuditLogListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface AuditLogListQuery {
  page: number
  pageSize: number
}

export interface AuditLogTableRow {
  id: UUID
  actor: string
  action: string
  tableName: string
  recordId: string
  createdAt: string
}

export interface AuditState {
  items: AuditLogListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  isLoading: boolean
  error: string
}
