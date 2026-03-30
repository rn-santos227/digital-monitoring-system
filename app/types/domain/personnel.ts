import type {
  PersonnelInsert,
  PersonnelRow,
  PersonnelUpdate,
  UUID,
} from '../database.tables'

export type PersonnelCreateInput = PersonnelInsert
export type PersonnelUpdateInput = PersonnelUpdate

export interface PersonnelProfile extends PersonnelRow {
  rank_code: string
  rank_name: string
  unit_code: string
  unit_name: string
  unit_type: string
  employment_status: string
  service_status: string
}

export interface PersonnelSearchFilters {
  unit_id?: UUID
  rank_id?: UUID
  employment_status_id?: UUID
  service_status_id?: UUID
  sex?: PersonnelRow['sex']
  is_active_only?: boolean
}
