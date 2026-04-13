export interface LogActionInput {
  userId?: string | null
  action: string
  tableName: string
  recordId?: string | null
  oldData?: Record<string, unknown> | null
  newData?: Record<string, unknown> | null
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

