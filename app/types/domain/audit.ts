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
