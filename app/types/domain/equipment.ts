import type {
  EquipmentAssetsInsert,
  EquipmentAssetsRow,
  EquipmentAssetsUpdate,
  EquipmentIssuancesInsert,
  EquipmentIssuancesRow,
  EquipmentIssuancesUpdate,
  UUID,
} from '../database.tables'

export type EquipmentAssetCreateInput = EquipmentAssetsInsert
export type EquipmentAssetUpdateInput = EquipmentAssetsUpdate

export type EquipmentIssuanceCreateInput = EquipmentIssuancesInsert
export type EquipmentIssuanceUpdateInput = EquipmentIssuancesUpdate

export interface EquipmentAccountabilityRow {
  equipment_asset_id: UUID
  asset_tag: string
  serial_no: string | null
  batch_no: string | null
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
  issuance_id: UUID | null
  latest_issue_no: string | null
  latest_issue_date: string | null
  latest_expected_return_date: string | null
  latest_actual_return_date: string | null
  latest_issuance_status: string | null
  issued_to_personnel_code: string | null
  issued_to_last_name: string | null
  issued_to_first_name: string | null
}

export interface EquipmentServiceabilityAggregate {
  serviceability_status: string
  condition_status: string
  asset_count: number
}

export interface EquipmentAssetWithIssuance {
  asset: EquipmentAssetsRow
  latest_issuance: EquipmentIssuancesRow | null
}

export interface EquipmentFilters {
  equipment_item_id?: UUID
  category_id?: UUID
  assigned_personnel_id?: UUID
  assigned_company_id?: UUID
  assigned_battalion_id?: UUID
  serviceability_status_id?: UUID
  asset_status_id?: UUID
}

export interface EquipmentCategoryListItem {
  id: string
  code: string
  name: string
  isActive: boolean
  itemCount: number
  updatedAt: string
}

export interface EquipmentCategoryDetailItem extends EquipmentCategoryListItem {
}

export interface EquipmentCategoryEndpointQuery {
  page?: number
  pageSize?: number
}

export interface EquipmentCategorySearchQuery extends EquipmentCategoryEndpointQuery {
  term?: string
  fields?: string
  isActive?: boolean
}

export interface EquipmentCategorySuggestionItem {
  id: string
  code: string
  name: string
  isActive: boolean
  itemCount: number
}

export interface EquipmentCategorySuggestionQuery {
  term?: string
  pageSize?: number
  selectedId?: string
}

export interface EquipmentCategorySuggestionResponse {
  items: EquipmentCategorySuggestionItem[]
}

export interface EquipmentCategoryFormValues {
  code: string
  name: string
  isActive: boolean
}

export type EquipmentCategoryTableActionKey =
  | 'view-equipment-category'
  | 'edit-equipment-category'
  | 'delete-equipment-category'

export interface EquipmentCategoryTableRow extends EquipmentCategoryListItem {
  status: 'Active' | 'Inactive'
}

export interface EquipmentCategoryTableActionPayload {
  actionKey: EquipmentCategoryTableActionKey
  row: EquipmentCategoryTableRow
}

export interface EquipmentCategoryListResponse {
  items: EquipmentCategoryListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface EquipmentCategoryKpiCounts {
  totalCategories: number
  unusedCategories: number
}

export interface CreateEquipmentCategoryPayload {
  code: string
  name: string
  isActive?: boolean
}

export interface UpdateEquipmentCategoryPayload {
  code?: string
  name?: string
  isActive?: boolean
}

export interface CreateEquipmentCategoryResponse {
  ok: boolean
  id: string
  item: EquipmentCategoryListItem
}

export interface EquipmentCategoriesState {
  items: EquipmentCategoryListItem[]
  kpis: EquipmentCategoryKpiCounts
  hasLoadedKpis: boolean
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
  isLoading: boolean
  error: string
}

export interface EquipmentItemListItem {
  id: string
  equipmentCode: string
  categoryId: string
  categoryCode: string
  categoryName: string
  name: string
  model: string | null
  manufacturer: string | null
  description: string | null
  unitOfMeasure: string | null
  minimumStockLevel: number
  isSerialized: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EquipmentItemSuggestionItem {
  id: string
  equipmentCode: string
  name: string
  categoryName: string
  isActive: boolean
}

export interface EquipmentItemSuggestionQuery {
  term?: string
  pageSize?: number
  selectedId?: string
}

export interface EquipmentItemSuggestionResponse {
  items: EquipmentItemSuggestionItem[]
}

export interface EquipmentItemSearchQuery extends EquipmentCategoryEndpointQuery {
  term?: string
  fields?: string
}

export type EquipmentItemTableActionKey =
  | 'view-equipment-item'
  | 'edit-equipment-item'
  | 'delete-equipment-item'

export interface EquipmentItemTableRow extends EquipmentItemListItem {
  status: 'Active' | 'Inactive'
}

export interface EquipmentItemListResponse {
  items: EquipmentItemListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface EquipmentItemKpiCounts {
  totalItems: number
}

export interface CreateEquipmentItemPayload {
  equipmentCode: string
  categoryId: string
  name: string
  model?: string
  manufacturer?: string
  description?: string
  unitOfMeasure?: string
  minimumStockLevel: number
  isSerialized?: boolean
  isActive?: boolean
}

export interface UpdateEquipmentItemPayload extends Partial<CreateEquipmentItemPayload> {}

export interface CreateEquipmentItemResponse {
  ok: boolean
  id: string
  item: EquipmentItemListItem
}

export interface EquipmentAssetListItem {
  id: string
  assetTag: string
  equipmentItemId: string
  equipmentItemCode: string
  equipmentItemName: string
  serialNo: string | null
  batchNo: string | null
  procurementDate: string | null
  acquisitionCost: number | null
  fundSource: string | null
  currentLocation: string | null
  conditionStatusId: string | null
  conditionStatusName: string | null
  serviceabilityStatusId: string | null
  serviceabilityStatusName: string | null
  assetStatusId: string
  assetStatusName: string
  remarks: string | null
  createdAt: string
  updatedAt: string
}

export interface EquipmentAssetKpiCounts {
  totalAssets: number
  issuedAssets: number
  notIssuedAssets: number
}

export interface EquipmentAssetSuggestionItem {
  id: string
  assetTag: string
  equipmentItemName: string
  categoryName: string
}

export interface EquipmentAssetSuggestionQuery {
  term?: string
  pageSize?: number
  selectedId?: string
}

export interface EquipmentAssetSuggestionResponse {
  items: EquipmentAssetSuggestionItem[]
}

export interface EquipmentAssetSearchQuery extends EquipmentCategoryEndpointQuery {
  term?: string
  fields?: string
}

export interface EquipmentAssetFormValues {
  assetTag: string
  equipmentItemId: string
  serialNo: string
  batchNo: string
  procurementDate: string
  acquisitionCost: number | null
  fundSource: string
  currentLocation: string
  conditionStatusId: string
  serviceabilityStatusId: string
  assetStatusId: string
  remarks: string
}

export interface EquipmentAssetTableRow extends EquipmentAssetListItem {}

export type EquipmentAssetTableActionKey =
  | 'view-equipment-asset'
  | 'edit-equipment-asset'
  | 'delete-equipment-asset'

export interface EquipmentAssetTableActionPayload {
  actionKey: EquipmentAssetTableActionKey
  row: EquipmentAssetTableRow
}

export interface EquipmentAssetListResponse {
  items: EquipmentAssetListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CreateEquipmentAssetPayload {
  assetTag: string
  equipmentItemId: string
  serialNo?: string | null
  batchNo?: string | null
  procurementDate?: string | null
  acquisitionCost?: number | null
  fundSource?: string | null
  currentLocation?: string | null
  conditionStatusId?: string | null
  serviceabilityStatusId?: string | null
  assetStatusId: string
  remarks?: string | null
}

export interface UpdateEquipmentAssetPayload extends Partial<CreateEquipmentAssetPayload> {}

export interface CreateEquipmentAssetResponse {
  ok: boolean
  id: string
  item: EquipmentAssetListItem
}

export interface EquipmentAssetsState {
  items: EquipmentAssetListItem[]
  kpis: EquipmentAssetKpiCounts
  hasLoadedKpis: boolean
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
  isLoading: boolean
  error: string
}

export interface EquipmentItemsState {
  items: EquipmentItemListItem[]
  kpis: EquipmentItemKpiCounts
  hasLoadedKpis: boolean
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
  isLoading: boolean
  error: string
}

export interface EquipmentIssuanceListItem {
  id: string
  issueNo: string
  equipmentAssetId: string
  equipmentAssetTag: string
  equipmentItemName: string
  issuedToPersonnelId: string
  issuedToPersonnelName: string
  issuedByPersonnelId: string
  issuedByPersonnelName: string
  deploymentId: string | null
  deploymentLabel: string | null
  issueDate: string
  expectedReturnDate: string | null
  actualReturnDate: string | null
  quantityIssued: number
  statusId: string
  statusName: string
  issuedLocation: string | null
  returnLocation: string | null
  remarks: string | null
  createdAt: string
  updatedAt: string
}

export interface EquipmentIssuanceSearchQuery extends EquipmentCategoryEndpointQuery {
  term?: string
  issuedToPersonnelId?: string
  statusId?: string
  statusName?: string
}

export interface EquipmentIssuanceTableRow extends EquipmentIssuanceListItem {}

export type EquipmentIssuanceTableActionKey =
  | 'view-equipment-issuance'
  | 'edit-equipment-issuance'
  | 'delete-equipment-issuance'

export interface EquipmentIssuanceTableActionPayload {
  actionKey: EquipmentIssuanceTableActionKey
  row: EquipmentIssuanceTableRow
}

export interface EquipmentIssuanceListResponse {
  items: EquipmentIssuanceListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface CreateEquipmentIssuancePayload {
  equipmentAssetId: string
  equipmentAssetStatusId: string
  issuedToPersonnelId: string
  issuedByPersonnelId: string
  deploymentId?: string | null
  issueDate: string
  expectedReturnDate?: string | null
  actualReturnDate?: string | null
  quantityIssued: number
  statusId: string
  issuedLocation?: string | null
  returnLocation?: string | null
  remarks?: string | null
}

export interface UpdateEquipmentIssuancePayload extends Partial<CreateEquipmentIssuancePayload> {}

export interface EquipmentIssuanceFormValues {
  equipmentAssetId: string
  issuedToPersonnelId: string
  issuedByPersonnelId: string
  deploymentId: string
  issueDate: string
  expectedReturnDate: string
  actualReturnDate: string
  quantityIssued: number
  statusId: string
  issuedLocation: string
  returnLocation: string
  remarks: string
}

export interface CreateEquipmentIssuanceResponse {
  ok: boolean
  id: string
  item: EquipmentIssuanceListItem
}

export interface EquipmentIssuancesState {
  items: EquipmentIssuanceListItem[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  error: string
  createError: string
  updateError: string
}
