export type EquipmentAccountingSubject = 'personnel' | 'company' | 'battalion'

export interface EquipmentAssignmentValueRow {
  equipment_asset_id: string
  asset_tag: string
  item_name: string
  acquisition_cost: number | string | null
  quantity: number
  assigned_value: number | string | null
  personnel_id: string | null
  company_id: string | null
  battalion_id: string | null
}

export interface EquipmentAssignmentValueItem {
  id: string
  assetTag: string
  itemName: string
  unitPrice: number | null
  quantity: number
  assignedValue: number | null
}

export interface EquipmentAssignmentValueSummary {
  assetCount: number
  quantity: number
  unpricedAssetCount: number
  totalValue: number
}

export interface EquipmentAssignmentValueSummaryRow {
  asset_count: number | string
  quantity: number | string
  unpriced_asset_count: number | string
  total_value: number | string
}
