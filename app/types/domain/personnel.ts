import type {
  PersonnelInsert,
  PersonnelRow,
  PersonnelUpdate,
  UUID,
} from '../database.tables'
import type { Sex } from '../enums'

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
  sex?: Sex
  is_active_only?: boolean
}

export interface PersonnelListItem {
  id: string
  personnelCode: string
  serviceNumber: string
  fullName: string
  sex: Sex
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

export interface PersonnelSuggestion {
  id: string
  personnelCode: string
  serviceNumber: string
  fullName: string
  rankName: string
  companyName: string | null
  battalionName: string | null
  serviceStatus: string
  suggestedEmail: string | null
}

export interface PersonnelSuggestionsQuery {
  term?: string
  pageSize?: number
  selectedPersonnelId?: string
}

export interface PersonnelSuggestionsEndpointResponse {
  items: PersonnelSuggestion[]
}

export interface PersonnelTablePagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PersonnelTableRow {
  id: string
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

export interface CreatePersonnelPayload {
  personnelCode: string
  serviceNumber: string
  lastName: string
  firstName: string
  middleName: string | null
  sex: Sex
  birthdate: string | null
  rankId: string
  companyId: string | null
  battalionId: string | null
  employmentStatusId: string
  serviceStatusId: string
  contactNumber: string | null
  dateEnlisted: string | null
}

export interface CreatePersonnelResponse {
  ok: boolean
  id: string
}

export interface PersonnelDetail {
  id: string
  personnelCode: string
  serviceNumber: string
  lastName: string
  firstName: string
  middleName: string | null
  sex: Sex
  birthdate: string | null
  rankId: string
  rankCode: string
  rankName: string
  companyId: string | null
  companyCode: string | null
  companyName: string | null
  battalionId: string | null
  battalionCode: string | null
  battalionName: string | null
  employmentStatusId: string
  employmentStatus: string
  serviceStatusId: string
  serviceStatus: string
  contactNumber: string | null
  dateEnlisted: string | null
  createdAt: string
  updatedAt: string
}

export type PersonnelProfileTabId = 'core' | 'training' | 'deployment' | 'engagement' | 'equipment-assignment'
