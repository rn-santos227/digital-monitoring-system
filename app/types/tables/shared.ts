export type UUID = string
export type ISODate = string
export type ISODateTime = string

export interface TableShape<Row, Insert, Update> {
  Row: Row
  Insert: Insert
  Update: Update
}

export type AuditColumns = {
  created_at: ISODateTime
  updated_at: ISODateTime
  created_by: UUID | null
}

export type AuditInsert = {
  created_at?: ISODateTime
  updated_at?: ISODateTime
  created_by: UUID | null
}
