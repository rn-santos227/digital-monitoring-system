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
