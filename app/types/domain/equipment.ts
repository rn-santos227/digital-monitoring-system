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

export interface EquipmentItemsState {
  items: EquipmentItemListItem[]
  pagination: {
    page: number
    pageSize: number
    totalItems: number
    totalPages: number
  }
  isLoading: boolean
  error: string
}
