import { createError } from 'h3'
import type { 
  CreateEquipmentAssetRequest,
  CreateEquipmentCategoryRequest,
  CreateEquipmentItemRequest,
  UpdateEquipmentAssetRequest,
  UpdateEquipmentCategoryRequest,
  UpdateEquipmentItemRequest
} from '../../requests'
import type { EquipmentAssetUpdate, EquipmentCategoryUpdate, EquipmentItemUpdate } from '../../models'
import { normalizeOptionalText } from '../../utils'

export const parseCreateEquipmentCategoryPayload = (body: CreateEquipmentCategoryRequest) => {
  const code = normalizeOptionalText(body.code)?.toUpperCase()
  const name = normalizeOptionalText(body.name)

  if (!code) {
    throw createError({ statusCode: 400, statusMessage: 'Equipment category code is required.' })
  }

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Equipment category name is required.' })
  }

  return {
    code,
    name,
    requires_serial: body.requiresSerial ?? false,
    is_consumable: body.isConsumable ?? false,
    is_controlled: body.isControlled ?? false,
    is_active: body.isActive ?? true,
  }
}

export const buildEquipmentCategoryUpdates = (body: UpdateEquipmentCategoryRequest): EquipmentCategoryUpdate => {
  const updates: EquipmentCategoryUpdate = {}

  const code = normalizeOptionalText(body.code)
  if (code) {
    updates.code = code.toUpperCase()
  }

  const name = normalizeOptionalText(body.name)
  if (name) {
    updates.name = name
  }

  if (typeof body.requiresSerial === 'boolean') {
    updates.requires_serial = body.requiresSerial
  }

  if (typeof body.isConsumable === 'boolean') {
    updates.is_consumable = body.isConsumable
  }

  if (typeof body.isControlled === 'boolean') {
    updates.is_controlled = body.isControlled
  }

  if (typeof body.isActive === 'boolean') {
    updates.is_active = body.isActive
  }

  return updates
}

export const parseCreateEquipmentItemPayload = (body: CreateEquipmentItemRequest) => {
  const equipmentCode = normalizeOptionalText(body.equipmentCode)?.toUpperCase()
  const categoryId = normalizeOptionalText(body.categoryId)
  const name = normalizeOptionalText(body.name)

  if (!equipmentCode) {
    throw createError({ statusCode: 400, statusMessage: 'Equipment item code is required.' })
  }

  if (!categoryId) {
    throw createError({ statusCode: 400, statusMessage: 'Equipment category is required.' })
  }

  if (!name) {
    throw createError({ statusCode: 400, statusMessage: 'Equipment item name is required.' })
  }

  const minimumStockLevel = Math.trunc(Number(body.minimumStockLevel ?? 0))

  if (!Number.isFinite(minimumStockLevel) || minimumStockLevel < 0) {
    throw createError({ statusCode: 400, statusMessage: 'Minimum stock level must be a non-negative whole number.' })
  }

  return {
    equipment_code: equipmentCode,
    category_id: categoryId,
    name,
    model: normalizeOptionalText(body.model) ?? null,
    manufacturer: normalizeOptionalText(body.manufacturer) ?? null,
    description: normalizeOptionalText(body.description) ?? null,
    unit_of_measure: normalizeOptionalText(body.unitOfMeasure) ?? null,
    minimum_stock_level: minimumStockLevel,
    is_serialized: body.isSerialized ?? false,
    is_active: body.isActive ?? true,
  }
}

export const buildEquipmentItemUpdates = (body: UpdateEquipmentItemRequest): EquipmentItemUpdate => {
  const updates: EquipmentItemUpdate = {}
  const equipmentCode = normalizeOptionalText(body.equipmentCode)

  if (equipmentCode) {
    updates.equipment_code = equipmentCode.toUpperCase()
  }

  const categoryId = normalizeOptionalText(body.categoryId)

  if (categoryId) {
    updates.category_id = categoryId
  }

  const name = normalizeOptionalText(body.name)

  if (name) {
    updates.name = name
  }

  if ('model' in body) {
    updates.model = normalizeOptionalText(body.model ?? undefined) ?? null
  }

  if ('manufacturer' in body) {
    updates.manufacturer = normalizeOptionalText(body.manufacturer ?? undefined) ?? null
  }

  if ('description' in body) {
    updates.description = normalizeOptionalText(body.description ?? undefined) ?? null
  }

  if ('unitOfMeasure' in body) {
    updates.unit_of_measure = normalizeOptionalText(body.unitOfMeasure ?? undefined) ?? null
  }

  if (typeof body.minimumStockLevel !== 'undefined') {
    const minimumStockLevel = Math.trunc(Number(body.minimumStockLevel))

    if (!Number.isFinite(minimumStockLevel) || minimumStockLevel < 0) {
      throw createError({ statusCode: 400, statusMessage: 'Minimum stock level must be a non-negative whole number.' })
    }

    updates.minimum_stock_level = minimumStockLevel
  }

  if (typeof body.isSerialized === 'boolean') {
    updates.is_serialized = body.isSerialized
  }

  if (typeof body.isActive === 'boolean') {
    updates.is_active = body.isActive
  }

  return updates
}

export const parseCreateEquipmentAssetPayload = (body: CreateEquipmentAssetRequest) => {
  const assetTag = normalizeOptionalText(body.assetTag)?.toUpperCase()
  const equipmentItemId = normalizeOptionalText(body.equipmentItemId)
  const assetStatusId = normalizeOptionalText(body.assetStatusId)

  if (!assetTag) throw createError({ statusCode: 400, statusMessage: 'Equipment asset tag is required.' })
  if (!equipmentItemId) throw createError({ statusCode: 400, statusMessage: 'Equipment item is required.' })
  if (!assetStatusId) throw createError({ statusCode: 400, statusMessage: 'Asset status is required.' })

  const acquisitionCostValue = body.acquisitionCost
  const acquisitionCost = acquisitionCostValue == null ? null : Number(acquisitionCostValue)

  if (acquisitionCost !== null && (!Number.isFinite(acquisitionCost) || acquisitionCost < 0)) {
    throw createError({ statusCode: 400, statusMessage: 'Acquisition cost must be a non-negative number.' })
  }

  return {
    asset_tag: assetTag,
    equipment_item_id: equipmentItemId,
    serial_no: normalizeOptionalText(body.serialNo ?? undefined) ?? null,
    batch_no: normalizeOptionalText(body.batchNo ?? undefined) ?? null,
    procurement_date: normalizeOptionalText(body.procurementDate ?? undefined) ?? null,
    acquisition_cost: acquisitionCost,
    fund_source: normalizeOptionalText(body.fundSource ?? undefined) ?? null,
    current_location: normalizeOptionalText(body.currentLocation ?? undefined) ?? null,
    condition_status_id: normalizeOptionalText(body.conditionStatusId ?? undefined) ?? null,
    serviceability_status_id: normalizeOptionalText(body.serviceabilityStatusId ?? undefined) ?? null,
    asset_status_id: assetStatusId,
    remarks: normalizeOptionalText(body.remarks ?? undefined) ?? null,
  }
}

export const buildEquipmentAssetUpdates = (body: UpdateEquipmentAssetRequest): EquipmentAssetUpdate => {
  const updates: EquipmentAssetUpdate = {}

  const assetTag = normalizeOptionalText(body.assetTag)
  if (assetTag) updates.asset_tag = assetTag.toUpperCase()

  const equipmentItemId = normalizeOptionalText(body.equipmentItemId)
  if (equipmentItemId) updates.equipment_item_id = equipmentItemId

  if ('serialNo' in body) updates.serial_no = normalizeOptionalText(body.serialNo ?? undefined) ?? null
  if ('batchNo' in body) updates.batch_no = normalizeOptionalText(body.batchNo ?? undefined) ?? null
  if ('procurementDate' in body) updates.procurement_date = normalizeOptionalText(body.procurementDate ?? undefined) ?? null

  if ('acquisitionCost' in body) {
    const value = body.acquisitionCost
    const acquisitionCost = value == null ? null : Number(value)
    if (acquisitionCost !== null && (!Number.isFinite(acquisitionCost) || acquisitionCost < 0)) {
      throw createError({ statusCode: 400, statusMessage: 'Acquisition cost must be a non-negative number.' })
    }
    updates.acquisition_cost = acquisitionCost
  }

  if ('fundSource' in body) updates.fund_source = normalizeOptionalText(body.fundSource ?? undefined) ?? null
  if ('currentLocation' in body) updates.current_location = normalizeOptionalText(body.currentLocation ?? undefined) ?? null
  if ('conditionStatusId' in body) updates.condition_status_id = normalizeOptionalText(body.conditionStatusId ?? undefined) ?? null
  if ('serviceabilityStatusId' in body) updates.serviceability_status_id = normalizeOptionalText(body.serviceabilityStatusId ?? undefined) ?? null

  const assetStatusId = normalizeOptionalText(body.assetStatusId)
  if (assetStatusId) updates.asset_status_id = assetStatusId

  if ('remarks' in body) updates.remarks = normalizeOptionalText(body.remarks ?? undefined) ?? null

  return updates
}
