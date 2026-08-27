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

  })
}
