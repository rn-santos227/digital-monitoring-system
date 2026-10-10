import { describe, expect, it } from 'vitest'

import { MAX_BULK_MUTATION_ITEMS } from '@/server/shared/constants/lib/bulk-management'
import {
  getBulkDomainDefinition,
  parseBulkIds,
  parseBulkUpdateItems,
} from '@/server/shared/utils/bulk-management'

describe('bulk request validation', () => {
  it('trims ids and permits the maximum batch size', () => {
    expect(parseBulkIds([' a ', 'b'])).toEqual(['a', 'b'])
    expect(
      parseBulkIds(
        Array.from({ length: MAX_BULK_MUTATION_ITEMS }, (_, index) =>
          String(index),
        ),
      ),
    ).toHaveLength(MAX_BULK_MUTATION_ITEMS)
  })

  it.each([
    undefined,
    {},
    [],
    [''],
    ['a', ' a '],
    [1],
    Array.from({ length: MAX_BULK_MUTATION_ITEMS + 1 }, (_, index) =>
      String(index),
    ),
  ])('rejects empty, duplicate, non-string, or oversized ids %j', (ids) => {
    expect(() => parseBulkIds(ids)).toThrow()
  })

  it('copies allowed updates and rejects unsupported fields', () => {
    const updates = { name: 'New name', is_active: false }
    const parsed = parseBulkUpdateItems(
      [{ id: ' record ', updates }],
      ['name', 'is_active'],
    )
    expect(parsed).toEqual([{ id: 'record', updates }])
    expect(parsed[0]?.updates).not.toBe(updates)
    expect(() =>
      parseBulkUpdateItems(
        [{ id: 'record', updates: { created_at: 'today' } }],
        ['name'],
      ),
    ).toThrow('Unsupported update fields')
  })

  it.each([null, [], {}, undefined])(
    'rejects missing or empty updates %j',
    (updates) => {
      expect(() =>
        parseBulkUpdateItems([{ id: 'record', updates }], ['name']),
      ).toThrow()
    },
  )

  it('rejects non-array items and unknown domains', () => {
    expect(() => parseBulkUpdateItems({}, [])).toThrow('items must be an array')
    expect(getBulkDomainDefinition('missing')).toBeUndefined()
    expect(getBulkDomainDefinition('personnel')).toMatchObject({
      table: 'personnel',
      updatePermissions: ['personnel.update'],
    })
  })
})
