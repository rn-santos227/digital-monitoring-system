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
