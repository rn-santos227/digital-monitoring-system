import type { AuditColumns, AuditInsert, ISODate, UUID } from './shared'

export type RanksRow = AuditColumns & {
  id: UUID
  code: string
  name: string
  sort_order: number
}
export type RanksInsert = AuditInsert & Omit<RanksRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type RanksUpdate = Partial<RanksInsert>

export type BattalionsRow = AuditColumns & {
  id: UUID
  code: string
  name: string
  is_active: boolean
}
export type BattalionsInsert = AuditInsert & Omit<BattalionsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type BattalionsUpdate = Partial<BattalionsInsert>

export type CompaniesRow = AuditColumns & {
  id: UUID
  battalion_id: UUID | null
  code: string
  name: string
  is_active: boolean
}
export type CompaniesInsert = AuditInsert & Omit<CompaniesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type CompaniesUpdate = Partial<CompaniesInsert>

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
  company_id: UUID
  employment_status_id: UUID
  service_status_id: UUID
  contact_number: string | null
  date_enlisted: ISODate | null
}
export type PersonnelInsert = AuditInsert & Omit<PersonnelRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type PersonnelUpdate = Partial<PersonnelInsert>
