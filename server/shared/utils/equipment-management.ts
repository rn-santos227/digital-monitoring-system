import type {
  EquipmentAssetListItem,
  EquipmentAssetRow,
  EquipmentAssetSuggestionItem,
  EquipmentAssetSuggestionRow,
  EquipmentIssuanceListItem,
  EquipmentIssuanceRow,
  EquipmentCategoryListItem,
  EquipmentCategoryRow,
  EquipmentCategorySuggestionItem,
  EquipmentCategorySuggestionRow,
  EquipmentItemListItem,
  EquipmentItemRow,
  EquipmentItemSuggestionItem,
  EquipmentItemSuggestionRow,
} from '../models'
import { parseNumber } from './parsers'

export const mapEquipmentCategoryListItem = (row: EquipmentCategoryRow): EquipmentCategoryListItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  requiresSerial: row.requires_serial,
  isConsumable: row.is_consumable,
  isControlled: row.is_controlled,
  isActive: row.is_active,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
})

export const mapEquipmentCategorySuggestionItem = (row: EquipmentCategorySuggestionRow): EquipmentCategorySuggestionItem => ({
  id: row.id,
  code: row.code,
  name: row.name,
  isActive: row.is_active,
})

export const parseEquipmentCategorySuggestionQuery = (query: {
  term?: unknown
  pageSize?: unknown
  selectedId?: unknown
}) => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const selectedId = typeof query.selectedId === 'string' && query.selectedId.length > 0
    ? query.selectedId
    : null
  const rawPageSize = Math.trunc(parseNumber(query.pageSize, 10))
  const pageSize = Math.min(Math.max(rawPageSize, 1), 20)

  return {
    term,
    pageSize,
    selectedId,
  }
}


export const mapEquipmentItemListItem = (row: EquipmentItemRow): EquipmentItemListItem => {
  const categoryValue = Array.isArray(row.category)
    ? (row.category[0] ?? null)
    : row.category

  return {
    id: row.id,
    equipmentCode: row.equipment_code,
    categoryId: row.category_id,
    categoryCode: categoryValue?.code ?? '',
    categoryName: categoryValue?.name ?? '',
    name: row.name,
    model: row.model,
    manufacturer: row.manufacturer,
    description: row.description,
    unitOfMeasure: row.unit_of_measure,
    minimumStockLevel: row.minimum_stock_level,
    isSerialized: row.is_serialized,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const mapEquipmentItemSuggestionItem = (row: EquipmentItemSuggestionRow): EquipmentItemSuggestionItem => ({
  id: row.id,
  equipmentCode: row.equipment_code,
  name: row.name,
  categoryName: Array.isArray(row.category)
    ? (row.category[0]?.name ?? '')
    : (row.category?.name ?? ''),
  isActive: row.is_active,
})

export const parseEquipmentItemSuggestionQuery = (query: {
  term?: unknown
  pageSize?: unknown
  selectedId?: unknown
}) => {
  const term = typeof query.term === 'string' ? query.term.trim() : ''
  const selectedId = typeof query.selectedId === 'string' && query.selectedId.length > 0
    ? query.selectedId
    : null
  const rawPageSize = Math.trunc(parseNumber(query.pageSize, 10))
  const pageSize = Math.min(Math.max(rawPageSize, 1), 20)

  return {
    term,
    pageSize,
    selectedId,
  }
}

export const mapEquipmentAssetListItem = (row: EquipmentAssetRow): EquipmentAssetListItem => {
  const equipmentItem = Array.isArray(row.equipment_item) ? (row.equipment_item[0] ?? null) : row.equipment_item
  const conditionStatus = Array.isArray(row.condition_status) ? (row.condition_status[0] ?? null) : row.condition_status
  const serviceabilityStatus = Array.isArray(row.serviceability_status) ? (row.serviceability_status[0] ?? null) : row.serviceability_status
  const assetStatus = Array.isArray(row.asset_status) ? (row.asset_status[0] ?? null) : row.asset_status

  return {
    id: row.id,
    assetTag: row.asset_tag,
    equipmentItemId: row.equipment_item_id,
    equipmentItemCode: equipmentItem?.equipment_code ?? '',
    equipmentItemName: equipmentItem?.name ?? '',
    serialNo: row.serial_no,
    batchNo: row.batch_no,
    procurementDate: row.procurement_date,
    acquisitionCost: row.acquisition_cost,
    fundSource: row.fund_source,
    currentLocation: row.current_location,
    conditionStatusId: row.condition_status_id,
    conditionStatusName: conditionStatus?.name ?? null,
    serviceabilityStatusId: row.serviceability_status_id,
    serviceabilityStatusName: serviceabilityStatus?.name ?? null,
    assetStatusId: row.asset_status_id,
    assetStatusName: assetStatus?.name ?? '',
    remarks: row.remarks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export const mapEquipmentAssetSuggestionItem = (row: EquipmentAssetSuggestionRow): EquipmentAssetSuggestionItem => ({
  id: row.id,
  assetTag: row.asset_tag,
  equipmentItemName: Array.isArray(row.equipment_item) ? (row.equipment_item[0]?.name ?? '') : (row.equipment_item?.name ?? ''),
})

const mapPersonnelDisplayName = (personnel: { personnel_code: string; first_name: string; middle_name: string | null; last_name: string } | null) => {
  if (!personnel) {
    return ''
  }

  const middleName = personnel.middle_name ? ` ${personnel.middle_name}` : ''

  return `${personnel.last_name}, ${personnel.first_name}${middleName} (${personnel.personnel_code})`
}

const normalizeSingleRelation = <T>(value: T | T[] | null): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export const mapEquipmentIssuanceListItem = (
  row: EquipmentIssuanceRow,
): EquipmentIssuanceListItem => {
  const equipmentAssetValue = normalizeSingleRelation(row.equipment_asset)
  const equipmentItemValue = normalizeSingleRelation(equipmentAssetValue?.equipment_item ?? null)
  const issuedToPersonnelValue = normalizeSingleRelation(row.issued_to_personnel)
  const issuedByPersonnelValue = normalizeSingleRelation(row.issued_by_personnel)
  const deploymentValue = normalizeSingleRelation(row.deployment)
  const issuanceStatusValue = normalizeSingleRelation(row.issuance_status)

  return {
    id: row.id,
    issueNo: row.issue_no,
    equipmentAssetId: row.equipment_asset_id,
    equipmentAssetTag: equipmentAssetValue?.asset_tag ?? '',
    equipmentItemName: equipmentItemValue?.name ?? '',
    issuedToPersonnelId: row.issued_to_personnel_id,
    issuedToPersonnelName: mapPersonnelDisplayName(issuedToPersonnelValue),
    issuedByPersonnelId: row.issued_by_personnel_id,
    issuedByPersonnelName: mapPersonnelDisplayName(issuedByPersonnelValue),
    deploymentId: row.deployment_id,
    deploymentLabel: deploymentValue ? `${deploymentValue.operation_name} (${deploymentValue.deployment_area})` : null,
    issueDate: row.issue_date,
    expectedReturnDate: row.expected_return_date,
    actualReturnDate: row.actual_return_date,
    quantityIssued: row.quantity_issued,
    statusId: row.status_id,
    statusName: issuanceStatusValue?.name ?? '',
    issuedLocation: row.issued_location,
    returnLocation: row.return_location,
    remarks: row.remarks,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}
