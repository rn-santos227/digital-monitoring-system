import { createError } from 'h3'
import type { CreateEquipmentCategoryRequest, CreateEquipmentItemRequest, UpdateEquipmentCategoryRequest, UpdateEquipmentItemRequest } from '../../requests'
import type { EquipmentCategoryUpdate, EquipmentItemUpdate } from '../../models'
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
