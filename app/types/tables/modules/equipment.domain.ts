import type { AuditColumns, AuditInsert, ISODate, UUID } from '../shared'

export type EquipmentCategoriesRow = AuditColumns & {
  id: UUID
  code: string
  name: string
  requires_serial: boolean
  is_consumable: boolean
  is_controlled: boolean
  is_active: boolean
}
export type EquipmentCategoriesInsert = AuditInsert & Omit<EquipmentCategoriesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type EquipmentCategoriesUpdate = Partial<EquipmentCategoriesInsert>

export type EquipmentItemsRow = AuditColumns & {
  id: UUID
  equipment_code: string
  category_id: UUID
  name: string
  model: string | null
  manufacturer: string | null
  description: string | null
  unit_of_measure: string | null
  minimum_stock_level: number
  is_serialized: boolean
  is_active: boolean
}
export type EquipmentItemsInsert = AuditInsert & Omit<EquipmentItemsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type EquipmentItemsUpdate = Partial<EquipmentItemsInsert>

