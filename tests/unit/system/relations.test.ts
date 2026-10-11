import { describe, expect, it } from 'vitest'

import { firstRelatedItem } from '@/server/shared/utils/relations'

describe('single Supabase relation normalization', () => {
  it('returns the original relation or first array item', () => {
    const row = { id: 'record' }
    expect(firstRelatedItem(row)).toBe(row)
    expect(firstRelatedItem([row, { id: 'ignored' }])).toBe(row)
  })

  it.each([null, undefined, []])(
    'uses null for missing relation %j',
    (value) => {
      expect(firstRelatedItem(value)).toBeNull()
    },
  )
})
