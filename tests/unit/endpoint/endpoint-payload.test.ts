import { describe, expect, it } from 'vitest'

import {
  parseCreateEquipmentCategoryPayload,
  parseCreateEquipmentItemPayload,
} from '../../../../server/shared/validations/domain/equipment-management'

describe('equipment endpoint payloads', () => {
  it('normalizes category codes and applies endpoint defaults', () => {
    expect(parseCreateEquipmentCategoryPayload({
      code: ' comms ',
      name: ' Communications ',
    })).toEqual({
      code: 'COMMS',
      name: 'Communications',
      requires_serial: false,
      is_consumable: false,
      is_controlled: false,
      is_active: true,
    })
  })

  it('converts an equipment item stock level to a whole number', () => {
    const payload = parseCreateEquipmentItemPayload({
      equipmentCode: ' radio-01 ',
      categoryId: 'category-1',
      name: 'Field Radio',
      minimumStockLevel: 3.8,
    })

    expect(payload.equipment_code).toBe('RADIO-01')
    expect(payload.minimum_stock_level).toBe(3)
  })

  it('rejects negative equipment stock levels', () => {
    expect(() => parseCreateEquipmentItemPayload({

    })).toThrow('Minimum stock level must be a non-negative whole number.')
  })
}
