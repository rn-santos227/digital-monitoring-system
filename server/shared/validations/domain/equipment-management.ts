import { createError } from 'h3'
import type { CreateEquipmentCategoryRequest, UpdateEquipmentCategoryRequest } from '../../requests'
import type { EquipmentCategoryUpdate } from '../../models'
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
