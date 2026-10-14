import type {
  EquipmentAssignmentValueItem,
  EquipmentAssignmentValueRow,
  EquipmentAssignmentValueSummary,
  EquipmentAssignmentValueSummaryRow,
} from '../models'
import { EQUIPMENT_PRICE_MAX_VALUE } from '../constants/lib/equipment-accounting'

// Match the database's numeric(14, 2) storage without silently rounding prices.
export const isValidEquipmentPrice = (value: unknown): value is number => {
  return typeof value === 'number'
    && Number.isFinite(value)
    && value >= 0
    && value <= EQUIPMENT_PRICE_MAX_VALUE
    && Number(value.toFixed(2)) === value
}

export const mapEquipmentAssignmentValue = (row: EquipmentAssignmentValueRow): EquipmentAssignmentValueItem => ({
  id: row.equipment_asset_id,
  assetTag: row.asset_tag,
  itemName: row.item_name,
  unitPrice: row.acquisition_cost === null ? null : Number(row.acquisition_cost),
  quantity: Number(row.quantity),
  assignedValue: row.assigned_value === null ? null : Number(row.assigned_value),
})

export const mapEquipmentAssignmentValueSummary = (
  row: EquipmentAssignmentValueSummaryRow | null,
): EquipmentAssignmentValueSummary => ({
  assetCount: Number(row?.asset_count ?? 0),
  quantity: Number(row?.quantity ?? 0),
  unpricedAssetCount: Number(row?.unpriced_asset_count ?? 0),
  totalValue: Number(row?.total_value ?? 0),
})
