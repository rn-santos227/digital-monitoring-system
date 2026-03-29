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

type AuditInsert = {
  created_at?: ISODateTime
  updated_at?: ISODateTime
}

export type RanksRow = AuditColumns & {
  id: UUID
  code: string
  name: string
  sort_order: number
}
