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
  email: string
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
  email: string
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
  email: string
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
  email: string
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
  email: string
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
  position: string | null
  dateEnlisted: string | null
  profileImageUrl?: string | null
}

export interface CreatePersonnelResponse {
  ok: boolean
  id: string
}

export interface UpdatePersonnelPayload {
  personnelCode: string
  serviceNumber: string
  email: string
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
  position: string | null
  dateEnlisted: string | null
}

export interface UpdatePersonnelResponse {
  ok: boolean
}

export interface DeletePersonnelResponse {
  ok: boolean
}

export interface PersonnelBatchUploadResponse {
  ok: boolean
  insertedCount: number
}

export interface PersonnelDetail {
  id: string
  personnelCode: string
  serviceNumber: string
  email: string
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
  position: string | null
  dateEnlisted: string | null
  createdAt: string
  updatedAt: string
  age: number | null
}

export interface PersonnelTrainingRecordListItem {
  id: string
  title: string
  category: string | null
  status: string
  startDate: string | null
  endDate: string | null
  validUntil: string | null
  remarks: string | null
}

export interface PersonnelDeploymentRecordListItem {
  id: string
  deploymentArea: string
  operationName: string | null
  location: string | null
  assignmentRole: string | null
  status: string
  startDate: string
  endDate: string | null
}

export interface PersonnelEngagementRecordListItem {
  id: string
  title: string
  type: string
  status: string
  dateStart: string | null
  dateEnd: string | null
  remarks: string | null
}

export interface PersonnelRecordListResponse<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export type PersonnelProfileTabId = 'core' | 'training' | 'deployment' | 'engagement' | 'equipment-assignment'
export type PersonnelManagementTabId = 'personnel-records' | 'rank-management'
