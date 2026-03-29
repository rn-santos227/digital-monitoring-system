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

export type RanksInsert = AuditInsert & Omit<RanksRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type RanksUpdate = Partial<RanksInsert>

export type UnitsRow = AuditColumns & {
  id: UUID
  code: string
  name: string
  parent_unit_id: UUID | null
  unit_type: string
  is_active: boolean
}

export type UnitsInsert = AuditInsert & Omit<UnitsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type UnitsUpdate = Partial<UnitsInsert>

export type EmploymentStatusesRow = AuditColumns & { id: UUID; name: string }
export type EmploymentStatusesInsert = AuditInsert & Omit<EmploymentStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type EmploymentStatusesUpdate = Partial<EmploymentStatusesInsert>

export type ServiceStatusesRow = AuditColumns & { id: UUID; name: string }
export type ServiceStatusesInsert = AuditInsert & Omit<ServiceStatusesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type ServiceStatusesUpdate = Partial<ServiceStatusesInsert>

export type PersonnelRow = AuditColumns & {
  id: UUID
  personnel_code: string
  service_number: string
  last_name: string
  first_name: string
  middle_name: string | null
  sex: 'Male' | 'Female'
  birthdate: ISODate | null
  rank_id: UUID
  unit_id: UUID
  employment_status_id: UUID
  service_status_id: UUID
  contact_number: string | null
  date_enlisted: ISODate | null
}
