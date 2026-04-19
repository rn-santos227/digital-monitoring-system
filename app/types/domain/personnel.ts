import type {
  PersonnelInsert,
  PersonnelRow,
  PersonnelUpdate,
  UUID,
} from '../database.tables'

export type PersonnelCreateInput = PersonnelInsert
export type PersonnelUpdateInput = PersonnelUpdate

export interface PersonnelProfile extends PersonnelRow {
  full_name: string
  rank_code: string
  rank_name: string
  company_code: string | null
  company_name: string | null
  battalion_code: string | null
  battalion_name: string | null
  employment_status: string
  service_status: string
}

export interface PersonnelSearchFilters {
  company_id?: UUID
  rank_id?: UUID
  employment_status_id?: UUID
  service_status_id?: UUID
  sex?: PersonnelRow['sex']
  is_active_only?: boolean
}

export interface PersonnelListItem {
  id: string
  personnelCode: string
  serviceNumber: string
  fullName: string
  sex: 'Male' | 'Female'
  rankName: string
  companyName: string | null
  battalionName: string | null
  employmentStatus: string
  serviceStatus: string
  createdAt: string
  updatedAt: string
}

export interface PersonnelListCompactItem {
  id: string
  personnelCode: string
  serviceNumber: string
  fullName: string
  rankName: string
  companyName: string | null
  battalionName: string | null
  serviceStatus: string
}

export interface PersonnelListResponse {
  items: PersonnelListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelListCompactResponse {
  items: PersonnelListCompactItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelEndpointQuery {
  page?: number
  pageSize?: number
}

export interface PersonnelSearchQuery extends PersonnelEndpointQuery {
  term?: string
  fields?: string
}

export interface PersonnelTablePagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelTableRow {
  id: string
  avatarAlt: string
  personnelCode: string
  serviceNumber: string
  fullName: string
  rankName: string
  assignment: string
  serviceStatus: string
}

export interface PersonnelState {
  items: PersonnelListCompactItem[]
  pagination: PersonnelTablePagination
  isLoading: boolean
  error: string
}
