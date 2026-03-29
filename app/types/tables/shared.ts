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
}

export type AuditInsert = {
  created_at?: ISODateTime
  updated_at?: ISODateTime
}
