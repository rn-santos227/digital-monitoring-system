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
  })
})
