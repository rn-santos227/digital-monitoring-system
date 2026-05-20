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
