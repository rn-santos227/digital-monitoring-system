export interface EquipmentCategoryListItem {
  id: string
  code: string
  name: string
  requiresSerial: boolean
  isConsumable: boolean
  isControlled: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface EquipmentCategorySuggestionItem {
  id: string
  code: string
  name: string
  isActive: boolean
}

export interface EquipmentCategoryCreate {
  code: string
  name: string
  requires_serial: boolean
  is_consumable: boolean
  is_controlled: boolean
  is_active: boolean
}

export interface EquipmentCategoryUpdate {
  code?: string
  name?: string
  requires_serial?: boolean
  is_consumable?: boolean
  is_controlled?: boolean
  is_active?: boolean
}

export interface EquipmentCategoryRow {
  id: string
  code: string
  name: string
  requires_serial: boolean
  is_consumable: boolean
  is_controlled: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EquipmentCategorySuggestionRow {
  id: string
  code: string
  name: string
  is_active: boolean
}

export interface EquipmentCategoryListResponse {
  items: EquipmentCategoryListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface EquipmentCategorySuggestionResponse {
  items: EquipmentCategorySuggestionItem[]
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

export interface EquipmentItemCreate {
  equipment_code: string
  category_id: string
  name: string
  model: string | null
  manufacturer: string | null
  description: string | null
  unit_of_measure: string | null
  minimum_stock_level: number
  is_serialized: boolean
  is_active: boolean
}

export interface EquipmentItemUpdate {
  equipment_code?: string
  category_id?: string
  name?: string
  model?: string | null
  manufacturer?: string | null
  description?: string | null
  unit_of_measure?: string | null
  minimum_stock_level?: number
  is_serialized?: boolean
  is_active?: boolean
}

export interface EquipmentItemRow {
  id: string
  equipment_code: string
  category_id: string
  name: string
  model: string | null
  manufacturer: string | null
  description: string | null
  unit_of_measure: string | null
  minimum_stock_level: number
  is_serialized: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  category: {
    id: string
    code: string
    name: string
  } | {
    id: string
    code: string
    name: string
  }[] | null
}

export interface EquipmentItemSuggestionRow {
  id: string
  equipment_code: string
  name: string
  is_active: boolean
  category: {
    name: string
  } | {
    name: string
  }[] | null
}

export interface EquipmentItemListResponse {
  items: EquipmentItemListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface EquipmentItemSuggestionResponse {
  items: EquipmentItemSuggestionItem[]
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

export interface EquipmentAssetSuggestionItem {
  id: string
  assetTag: string
  equipmentItemName: string
  categoryName: string
}

export interface EquipmentAssetCreate {
  asset_tag: string
  equipment_item_id: string
  serial_no: string | null
  batch_no: string | null
  procurement_date: string | null
  acquisition_cost: number | null
  fund_source: string | null
  current_location: string | null
  condition_status_id: string | null
  serviceability_status_id: string | null
  asset_status_id: string
  remarks: string | null
}

export interface EquipmentAssetUpdate extends Partial<EquipmentAssetCreate> {}

export interface EquipmentAssetRow {
  id: string
  asset_tag: string
  equipment_item_id: string
  serial_no: string | null
  batch_no: string | null
  procurement_date: string | null
  acquisition_cost: number | null
  fund_source: string | null
  current_location: string | null
  condition_status_id: string | null
  serviceability_status_id: string | null
  asset_status_id: string
  remarks: string | null
  created_at: string
  updated_at: string
  equipment_item: { id: string; equipment_code: string; name: string } | { id: string; equipment_code: string; name: string }[] | null
  condition_status: { id: string; name: string } | { id: string; name: string }[] | null
  serviceability_status: { id: string; name: string } | { id: string; name: string }[] | null
  asset_status: { id: string; name: string } | { id: string; name: string }[] | null
}

export interface EquipmentAssetSuggestionRow {
  id: string
  asset_tag: string
  equipment_item: {
    name: string
    category: { name: string } | { name: string }[] | null
  } | {
    name: string
    category: { name: string } | { name: string }[] | null
  }[] | null
}

export interface EquipmentAssetListResponse {
  items: EquipmentAssetListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface EquipmentAssetKpiCounts {
  totalAssets: number
  issuedAssets: number
  notIssuedAssets: number
}

export interface EquipmentAssetSuggestionResponse {
  items: EquipmentAssetSuggestionItem[]
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

export interface EquipmentIssuanceCreate {
  equipment_asset_id: string
  issued_to_personnel_id: string
  issued_by_personnel_id: string
  deployment_id: string | null
  issue_date: string
  expected_return_date: string | null
  actual_return_date: string | null
  quantity_issued: number
  status_id: string
  issued_location: string | null
  return_location: string | null
  remarks: string | null
}

export interface EquipmentIssuanceUpdate extends Partial<EquipmentIssuanceCreate> {}

export interface EquipmentIssuanceRow extends EquipmentIssuanceCreate {
  id: string
  issue_no: string
  created_at: string
  updated_at: string
  equipment_asset: { id: string; asset_tag: string; equipment_item: { id: string; name: string } | { id: string; name: string }[] | null } | { id: string; asset_tag: string; equipment_item: { id: string; name: string } | { id: string; name: string }[] | null }[] | null
  issued_to_personnel: { id: string; personnel_code: string; first_name: string; middle_name: string | null; last_name: string } | { id: string; personnel_code: string; first_name: string; middle_name: string | null; last_name: string }[] | null
  issued_by_personnel: { id: string; personnel_code: string; first_name: string; middle_name: string | null; last_name: string } | { id: string; personnel_code: string; first_name: string; middle_name: string | null; last_name: string }[] | null
  deployment: { id: string; operation_name: string; deployment_area: string } | { id: string; operation_name: string; deployment_area: string }[] | null
  issuance_status: { id: string; name: string } | { id: string; name: string }[] | null
}

export interface EquipmentIssuanceListResponse {
  items: EquipmentIssuanceListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}
