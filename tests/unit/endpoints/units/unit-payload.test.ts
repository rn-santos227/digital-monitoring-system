import { describe, expect, it } from 'vitest'

import {
  parseAssignUnitPersonnelPayload,
  parseCreateBattalionPayload,
  parseCreateCompanyPayload,
} from '../../../../server/shared/validations/domain/unit-management'

describe('unit endpoint payloads', () => {
  it('normalizes battalion and company create requests', () => {
    expect(parseCreateBattalionPayload({ code: ' 1ib ', name: ' First Infantry ' })).toEqual({
      code: '1IB',
      name: 'First Infantry',
      is_active: true,
    })
    expect(parseCreateCompanyPayload({
      battalionId: ' battalion-1 ',
      code: ' alpha ',
      name: ' Alpha Company ',
    })).toEqual({
      battalion_id: 'battalion-1',
      code: 'ALPHA',
      name: 'Alpha Company',
      is_active: true,
    })
  })

  it('requires personnel for a unit assignment', () => {
    expect(() => parseAssignUnitPersonnelPayload({ personnelId: ' ' })).toThrow(
      'Personnel id is required.',
    )
  })
})
