import { describe, expect, it } from 'vitest'

import {
  parseCreateEquipmentCategoryPayload,
  parseCreateEquipmentItemPayload,
} from '../../../../server/shared/validations/domain/equipment-management'

describe('equipment endpoint payloads', () => {
  it('normalizes category codes and applies endpoint defaults', () => {
  it('normalizes category codes and applies endpoint defaults', () => {
    expect(parseCreateEquipmentCategoryPayload({
      code: ' comms ',
      name: ' Communications ',
    })).toEqual({

    })
  }
}
