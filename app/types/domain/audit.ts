export type UUID = string
export type ISODateTime = string
export type AuditLogSortKey = 'createdAt' | 'actor' | 'action' | 'tableName' | 'recordId' | 'ipAddress' | 'statusCode'

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
  ipAddress: string | null
  statusCode: number | null
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


export interface AuditLogActorDetail {
  id: string | null
  fullName: string | null
  email: string | null
  avatarUrl: string | null
  isActive: boolean | null
}

export interface AuditLogDetail {
  id: UUID
  userId: UUID | null
  action: string
  tableName: string
  recordId: string | null
  oldData: Record<string, unknown> | null
  newData: Record<string, unknown> | null
  requestData: Record<string, unknown> | null
  responseData: Record<string, unknown> | null
  requestHeaders: Record<string, string> | null
  ipAddress: string | null
  statusCode: number | null
  metadata: Record<string, unknown> | null
  createdAt: ISODateTime
  actor: AuditLogActorDetail | null
}

export interface AuditLogListQuery {
  page: number
  pageSize: number
}

export interface AuditLogSearchQuery extends AuditLogListQuery {
  term?: string
  fields?: string
  userName?: string
  startDate?: string
  endDate?: string
}

export interface AuditLogTableRow {
  id: UUID
  actor: string
  action: string
  tableName: string
  recordId: string
  ipAddress: string
  statusCode: string
  createdAt: string
}

export interface AuditState {
  items: AuditLogListItem[]
  selectedAuditLog: AuditLogDetail | null
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  isLoading: boolean
  isDetailLoading: boolean
  error: string
  detailError: string
}
