import { describe, expect, it, vi } from 'vitest'

import { applyNullableFilter } from '../../../../server/shared/utils/query-filters'

describe('nullable query filter behavior', () => {
  it('uses equality for a populated domain identifier', () => {
    const query = {
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
    }

    expect(applyNullableFilter(query, 'battalion_id', 'battalion-1')).toBe(query)
    expect(query.eq).toHaveBeenCalledWith('battalion_id', 'battalion-1')
    expect(query.is).not.toHaveBeenCalled()
  })

  it('uses an IS NULL filter when no domain identifier is provided', () => {

  })
})
