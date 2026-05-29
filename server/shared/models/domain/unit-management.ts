export interface UnitListResponse<TItem> {
  items: TItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface BattalionListItem {
  id: string
  code: string
  name: string
  isActive: boolean
  companyCount: number
  createdAt: string
  updatedAt: string
}

export interface CompanyListItem {
  id: string
  battalionId: string | null
  battalionCode: string | null
  battalionName: string | null
  code: string
  name: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface BattalionDetailItem extends BattalionListItem {
  companyCount: number
  personnelCount: number
  equipmentAssetCount: number
}

export interface CompanyDetailItem extends CompanyListItem {
  personnelCount: number
  equipmentAssetCount: number
}

export interface UnitManagementKpiCounts {
  totalCompanies: number
  totalBattalions: number
  totalUnassignedPersonnel: number
}

export interface BattalionRow {
  id: string
  code: string
  name: string
  is_active: boolean
  companies?: Array<{ count: number | null }> | null
  created_at: string
  updated_at: string
}

export interface BattalionReferenceRow {
  id: string
  code: string
  name: string
}

export interface CompanyRow {
  id: string
  battalion_id: string | null
  code: string
  name: string
  is_active: boolean
  created_at: string
  updated_at: string
  battalion: BattalionReferenceRow | BattalionReferenceRow[] | null
}


export interface BattalionCreate {
  code: string
  name: string
  is_active: boolean
}

export interface BattalionUpdate {
  code?: string
  name?: string
  is_active?: boolean
}

export interface CompanyCreate {
  battalion_id: string | null
  code: string
  name: string
  is_active: boolean
}

export interface CompanyUpdate {
  battalion_id?: string | null
  code?: string
  name?: string
  is_active?: boolean
}

export interface BattalionSuggestionItem {
  id: string
  code: string
  name: string
  isActive: boolean
}

export interface CompanySuggestionItem {
  id: string
  battalionId: string | null
  battalionCode: string | null
  battalionName: string | null
  code: string
  name: string
  isActive: boolean
}

export interface UnitSuggestionResponse<TItem> {
  items: TItem[]
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

export interface UnitPersonnelProfileRow {
  id: string
  personnel_code: string
  service_number: string
  full_name: string
  rank_name: string
  company_name: string | null
  battalion_name: string | null
  service_status: string
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

export interface UnitEquipmentAssetRow {
  equipment_asset_id: string
  asset_tag: string
  serial_no: string | null
  equipment_code: string
  item_name: string
  category_code: string
  category_name: string
  assigned_personnel_code: string | null
  assigned_personnel_last_name: string | null
  assigned_personnel_first_name: string | null
  assigned_company_code: string | null
  assigned_company_name: string | null
  assigned_battalion_code: string | null
  assigned_battalion_name: string | null
  current_location: string | null
  condition_status: string | null
  serviceability_status: string | null
  asset_status: string
  latest_issue_no: string | null
  latest_issue_date: string | null
  latest_issuance_status: string | null
}
