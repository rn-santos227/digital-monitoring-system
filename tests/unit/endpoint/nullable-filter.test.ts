import { describe, expect, it, vi } from 'vitest'

import { applyNullableFilter } from '../../../../server/shared/utils/query-filters'

describe('nullable query filter behavior', () => {
  it('uses equality for a populated domain identifier', () => {
    const query = {
      eq: vi.fn().mockReturnThis(),
      is: vi.fn().mockReturnThis(),
    }

  })
})
