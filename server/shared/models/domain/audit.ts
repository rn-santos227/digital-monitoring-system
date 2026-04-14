export interface LogActionInput {
  userId?: string | null
  action: string
  tableName: string
  recordId?: string | null
  oldData?: Record<string, unknown> | null
  newData?: Record<string, unknown> | null
  requestData?: Record<string, unknown> | null
  responseData?: Record<string, unknown> | null
  requestHeaders?: Record<string, string> | null
  ipAddress?: string | null
  statusCode?: number | null
  metadata?: Record<string, unknown> | null
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

export interface AuditLogActorDetail {
  id: string | null
  fullName: string | null
  email: string | null
  avatarUrl: string | null
  isActive: boolean | null
}

export interface AuditLogDetail {
  id: string
  userId: string | null
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
  createdAt: string
  actor: AuditLogActorDetail | null
}
