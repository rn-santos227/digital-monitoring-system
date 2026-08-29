import { describe, expect, it } from 'vitest'

import { parseCreateRankPayload } from '../../../../server/shared/validations/domain/rank-management'

describe('rank endpoint payloads', () => {
 it('normalizes a rank and truncates its sort order', () => {
    expect(parseCreateRankPayload({
      code: ' cpt ',
      name: ' Captain ',
      sortOrder: 4.9,
    })).toEqual({
      code: 'CPT',
      name: 'Captain',
      sort_order: 4,
    })
  })
})
