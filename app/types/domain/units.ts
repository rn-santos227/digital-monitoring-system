export type UnitManagementTabId = 'battalion' | 'company'

export interface BattalionListItem {
  id: string
  code: string
  name: string
  isActive: boolean
  companyCount: number
}

export interface CompanyListItem {
  id: string
  battalionId: string | null
  battalionCode: string | null
  battalionName: string | null
  code: string
  name: string
  isActive: boolean
}

export interface UnitListResponse<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface BattalionEndpointQuery {
  page?: number
  pageSize?: number
  search?: string
  includeInactive?: boolean
}

export interface BattalionSearchQuery extends BattalionEndpointQuery {
  term?: string
  fields?: string
  isActive?: boolean
}

export interface CompanyEndpointQuery {
  page?: number
  pageSize?: number
  search?: string
  includeInactive?: boolean
  battalionId?: string
}

export interface CompanySearchQuery extends CompanyEndpointQuery {
  term?: string
  fields?: string
  isActive?: boolean
}

export interface UnitsTablePagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface BattalionsState {
  items: BattalionListItem[]
  pagination: UnitsTablePagination
  isLoading: boolean
  error: string
}

export interface CompaniesState {
  items: CompanyListItem[]
  pagination: UnitsTablePagination
  isLoading: boolean
  error: string
}
