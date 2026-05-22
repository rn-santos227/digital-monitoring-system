export interface CreateEquipmentCategoryRequest {
  code?: string
  name?: string
  requiresSerial?: boolean
  isConsumable?: boolean
  isControlled?: boolean
  isActive?: boolean
}

export interface UpdateEquipmentCategoryRequest {
  code?: string
  name?: string
  requiresSerial?: boolean
  isConsumable?: boolean
  isControlled?: boolean
  isActive?: boolean
}

export interface CreateEquipmentItemRequest {
  equipmentCode?: string
  categoryId?: string
  name?: string
  model?: string
  manufacturer?: string
  description?: string
  unitOfMeasure?: string
  minimumStockLevel?: number
  isSerialized?: boolean
  isActive?: boolean
}

export interface UpdateEquipmentItemRequest {
  equipmentCode?: string
  categoryId?: string
  name?: string
  model?: string | null
  manufacturer?: string | null
  description?: string | null
  unitOfMeasure?: string | null
  minimumStockLevel?: number
  isSerialized?: boolean
  isActive?: boolean
}

export interface CreateEquipmentAssetRequest {
  assetTag?: string
  equipmentItemId?: string
  serialNo?: string | null
  batchNo?: string | null
  procurementDate?: string | null
  acquisitionCost?: number | null
  fundSource?: string | null
  currentLocation?: string | null
  conditionStatusId?: string | null
  serviceabilityStatusId?: string | null
  assetStatusId?: string
  remarks?: string | null
}

export interface UpdateEquipmentAssetRequest extends CreateEquipmentAssetRequest {}

export interface CreateEquipmentIssuanceRequest {
  equipmentAssetId?: string
  issuedToPersonnelId?: string
  issuedByPersonnelId?: string
  deploymentId?: string | null
  issueDate?: string
  expectedReturnDate?: string | null
  actualReturnDate?: string | null
  quantityIssued?: number
  statusId?: string
  issuedLocation?: string | null
  returnLocation?: string | null
  remarks?: string | null
}

export interface UpdateEquipmentIssuanceRequest extends CreateEquipmentIssuanceRequest {}
