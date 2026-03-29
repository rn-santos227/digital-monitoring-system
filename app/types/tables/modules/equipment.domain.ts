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

export type EquipmentAssetsRow = AuditColumns & {
  id: UUID
  asset_tag: string
  equipment_item_id: UUID
  serial_no: string | null
  batch_no: string | null
  procurement_date: ISODate | null
  acquisition_cost: number | null
  fund_source: string | null
  current_unit_id: UUID | null
  current_location: string | null
  condition_status_id: UUID | null
  serviceability_status_id: UUID | null
  asset_status_id: UUID
  remarks: string | null
}
export type EquipmentAssetsInsert = AuditInsert & Omit<EquipmentAssetsRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type EquipmentAssetsUpdate = Partial<EquipmentAssetsInsert>

export type EquipmentIssuancesRow = AuditColumns & {
  id: UUID
  issue_no: string
  equipment_asset_id: UUID
  issued_to_personnel_id: UUID
  issued_by_personnel_id: UUID | null
  issue_date: ISODate
  expected_return_date: ISODate | null
  actual_return_date: ISODate | null
  issue_purpose: string | null
  deployment_id: UUID | null
  status_id: UUID
  condition_on_issue_id: UUID | null
  condition_on_return_id: UUID | null
  remarks: string | null
}
export type EquipmentIssuancesInsert = AuditInsert & Omit<EquipmentIssuancesRow, keyof AuditColumns | 'id'> & { id?: UUID }
export type EquipmentIssuancesUpdate = Partial<EquipmentIssuancesInsert>

