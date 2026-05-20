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
