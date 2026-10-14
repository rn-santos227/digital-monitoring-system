import { describe, expect, it } from 'vitest'

import { getBattalionUsageCounts } from '@/server/utils/battalions/getBattalionUsageCounts'
import { getCompanyUsageCounts } from '@/server/utils/companies/getCompanyUsageCounts'
import { getRankUsageCounts } from '@/server/utils/ranks/getRankUsageCounts'
import { getEquipmentItemUsageCounts } from '@/server/utils/equipment-items/getEquipmentItemUsageCounts'
import { getEquipmentCategoryUsageCounts } from '@/server/utils/equipment-categories/getEquipmentCategoryUsageCounts'
import { getTrainingCategoryUsageCounts } from '@/server/utils/training-categories/getTrainingCategoryUsageCounts'
import { getTrainingUsageCountById } from '@/server/utils/trainings/getTrainingUsageCountById'
import { getEngagementUsageCountById } from '@/server/utils/engagements/getEngagementUsageCountById'
import {
  countTableRows,
  fetchStringColumnValues,
  resolveCountResult,
} from '@/server/utils/kpis/countTableRows'
import { createSupabaseMock } from '@/tests/helpers/supabase'

describe.each([
  {
    name: 'rank',
    table: 'personnel',
    column: 'rank_id',
    run: getRankUsageCounts,
    expected: { personnelCount: 2 },
  },
  {
    name: 'equipment item',
    table: 'equipment_assets',
    column: 'equipment_item_id',
    run: getEquipmentItemUsageCounts,
    expected: 2,
  },
  {
    name: 'equipment category',
    table: 'equipment_items',
    column: 'category_id',
    run: getEquipmentCategoryUsageCounts,
    expected: 2,
  },
  {
    name: 'training',
    table: 'training_records',
    column: 'training_id',
    run: getTrainingUsageCountById,
    expected: 2,
  },
  {
    name: 'engagement',
    table: 'engagement_records',
    column: 'engagement_id',
    run: getEngagementUsageCountById,
    expected: 2,
  },
])('$name usage safety', ({ table, column, run, expected }) => {
  it('counts references to the selected record without reading row contents', async () => {
    const database = createSupabaseMock([{ data: null, count: 2, error: null }])
    await expect(run(database.client, 'record')).resolves.toEqual(expected)
    expect(database.calls).toContainEqual({
      table,
      method: 'eq',
      args: [column, 'record'],
    })
    expect(database.calls).toContainEqual({
      table,
      method: 'select',
      args: ['id', { count: 'exact', head: true }],
    })
  })

  it('rejects database errors rather than reporting no usage', async () => {
    await expect(
      run(
        createSupabaseMock([{ data: null, error: { message: 'failed' } }])
          .client,
        'record',
      ),
    ).rejects.toMatchObject({ statusCode: 500 })
  })
})

describe('multi-table usage checks', () => {
  it('sums battalion and training-category usage and treats missing counts as zero', async () => {
    const results = [
      { data: null, count: 2, error: null },
      { data: null, count: null, error: null },
    ]
    await expect(
      getBattalionUsageCounts(createSupabaseMock(results).client, 'record'),
    ).resolves.toBe(2)
    await expect(
      getTrainingCategoryUsageCounts(
        createSupabaseMock(results).client,
        'record',
      ),
    ).resolves.toBe(2)
    await expect(
      getCompanyUsageCounts(createSupabaseMock(results).client, 'record'),
    ).resolves.toEqual({ personnelCount: 2, equipmentAssetCount: 0 })
  })

  it.each([0, 1])(
    'rejects a failed company or category check at index %s',
    async (index) => {
      const results = [0, 1].map((value) => ({
        data: null,
        count: 0,
        error: value === index ? { message: 'failed' } : null,
      }))
      await expect(
        getCompanyUsageCounts(createSupabaseMock(results).client, 'record'),
      ).rejects.toMatchObject({ statusCode: 500 })
      await expect(
        getTrainingCategoryUsageCounts(
          createSupabaseMock(results).client,
          'record',
        ),
      ).rejects.toMatchObject({ statusCode: 500 })
      await expect(
        getBattalionUsageCounts(createSupabaseMock(results).client, 'record'),
      ).rejects.toMatchObject({ statusCode: 500 })
    },
  )
})

describe('KPI query primitives', () => {
  it('handles missing counts and database failures', async () => {
    expect(resolveCountResult({ count: null, error: null }, 'records')).toBe(0)
    expect(() =>
      resolveCountResult(
        { count: null, error: { message: 'failed' } },
        'records',
      ),
    ).toThrow('Failed to count records')
    await expect(
      countTableRows(
        createSupabaseMock([{ data: null, count: 8, error: null }]).client,
        'personnel',
        'personnel',
      ),
    ).resolves.toBe(8)
  })

  it('reads all column pages and discards null, blank, or non-string values', async () => {
    const first = Array.from({ length: 1000 }, (_, index) => ({
      id: `id-${index}`,
    }))
    const database = createSupabaseMock([
      { data: first, error: null },
      {
        data: [{ id: 'last' }, { id: null }, { id: ' ' }, { id: 1 }],
        error: null,
      },
    ])
    const values = await fetchStringColumnValues(
      database.client,
      'personnel',
      'id',
      'personnel ids',
    )
    expect(values).toHaveLength(1001)
    expect(values.at(-1)).toBe('last')
    expect(database.calls).toContainEqual({
      table: 'personnel',
      method: 'range',
      args: [0, 999],
    })
    expect(database.calls).toContainEqual({
      table: 'personnel',
      method: 'range',
      args: [1000, 1999],
    })
    await expect(
      fetchStringColumnValues(
        createSupabaseMock().client,
        'personnel',
        'id',
        'ids',
      ),
    ).resolves.toEqual([])
    await expect(
      fetchStringColumnValues(
        createSupabaseMock([{ data: null, error: { message: 'failed' } }])
          .client,
        'personnel',
        'id',
        'ids',
      ),
    ).rejects.toMatchObject({ statusCode: 500 })
  })
})
