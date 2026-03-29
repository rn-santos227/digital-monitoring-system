export type UUID = string
export type ISODate = string
export type ISODateTime = string

export interface TableShape<Row, Insert, Update> {
  Row: Row
  Insert: Insert
  Update: Update
}

type AuditColumns = {
  created_at: ISODateTime
  updated_at: ISODateTime
}

