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

