import { describe, expect, it } from 'vitest'
import { parseCreateRankPayload } from '../../../../server/shared/validation/domain/rank-management'

describe('rank endpoint payloads', () => {
  it('normalizes a rank and truncates its sort order', () => {
    expect(
      parseCreateRankPayload({
        code: ' cpt ',
        name: ' Captain ',
        sortOrder: 4.9,
      }),
    ).toEqual({
      code: 'CPT',
      name: 'Captain',
      sort_order: 4,
    })
  })

  it('requires a rank name', () => {
    expect(() => parseCreateRankPayload({ code: 'CPT', name: ' ' })).toThrow(
      'Rank name is required.',
    )
  })
})
