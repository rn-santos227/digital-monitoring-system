export type UnitManagementTabId = 'battalion' | 'company'
export type UnitViewTabId = 'information' | 'personnel' | 'equipment' | 'companies'

export interface BattalionListItem {
  id: string
  code: string
  name: string
  isActive: boolean
  companyCount: number
}

export interface BattalionDetailItem extends BattalionListItem {
  personnelCount: number
  equipmentAssetCount: number
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


export interface CompanyDetailItem extends CompanyListItem {
  personnelCount: number
  equipmentAssetCount: number
}

export interface UnitPersonnelListItem {
  id: string
  personnelCode: string
  serviceNumber: string
  fullName: string
  rankName: string
  companyName: string | null
  battalionName: string | null
  serviceStatus: string
}

export interface UnitEquipmentAssetListItem {
  id: string
  assetTag: string
  serialNo: string | null
  equipmentCode: string
  itemName: string
  categoryCode: string
  categoryName: string
  assignedPersonnelCode: string | null
  assignedPersonnelName: string | null
  assignedCompanyCode: string | null
  assignedCompanyName: string | null
  assignedBattalionCode: string | null
  assignedBattalionName: string | null
  currentLocation: string | null
  conditionStatus: string | null
  serviceabilityStatus: string | null
  assetStatus: string
  latestIssueNo: string | null
  latestIssueDate: string | null
  latestIssuanceStatus: string | null
}

export interface CreateBattalionPayload {
  code: string
  name: string
  isActive: boolean
}

export interface CreateBattalionResponse {
  ok: boolean
  id: string
  item: BattalionListItem
}

export interface CreateCompanyResponse {
  ok: boolean
  id: string
  item: CompanyListItem
}

export interface UpdateBattalionPayload {
  code: string
  name: string
  isActive: boolean
}

export interface CreateCompanyPayload {
  battalionId: string | null
  code: string
  name: string
  isActive: boolean
}

export interface UpdateCompanyPayload {
  battalionId: string | null
  code: string
  name: string
  isActive: boolean
}

export interface UnitManagementKpis {
  totalCompanies: number
  totalBattalions: number
  totalUnassignedPersonnel: number
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
