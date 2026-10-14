import type { SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

import { fetchRankSuggestions } from '@/server/utils/ranks/fetchRankSuggestions'
import { fetchCompanySuggestions } from '@/server/utils/companies/fetchCompanySuggestions'
import { fetchBattalionSuggestions } from '@/server/utils/battalions/fetchBattalionSuggestions'
import { fetchTrainingSuggestions } from '@/server/utils/trainings/fetchTrainingSuggestions'
import { fetchDeploymentSuggestions } from '@/server/utils/deployments/fetchDeploymentSuggestions'
import { fetchEngagementSuggestions } from '@/server/utils/engagements/fetchEngagementSuggestions'
import { fetchEquipmentCategorySuggestions } from '@/server/utils/equipment-categories/fetchEquipmentCategorySuggestions'
import { fetchEquipmentItemSuggestions } from '@/server/utils/equipment-items/fetchEquipmentItemSuggestions'
import { fetchEquipmentAssetSuggestions } from '@/server/utils/equipment-assets/fetchEquipmentAssetSuggestions'
import { fetchIncidentTypeSuggestions } from '@/server/utils/incidents/fetchIncidentTypeSuggestions'
import { fetchInvestigationStatusSuggestions } from '@/server/utils/incidents/fetchInvestigationStatusSuggestions'
import { fetchPersonnelSuggestions } from '@/server/utils/personnel/fetchPersonnelSuggestions'
import { createSupabaseMock } from '@/tests/helpers/supabase'

type SuggestionQuery = (
  database: SupabaseClient,
  term: string,
  selectedId?: string | null,
) => Promise<unknown[]>
const contracts: { table: string; run: SuggestionQuery }[] = [
  {
    table: 'ranks',
    run: (database, term, selected) =>
      fetchRankSuggestions(database, term, 2, selected),
  },
  {
    table: 'companies',
    run: (database, term, selected) =>
      fetchCompanySuggestions(database, term, 2, 'battalion', selected),
  },
  {
    table: 'trainings',
    run: (database, term, selected) =>
      fetchTrainingSuggestions(database, 2, term, selected),
  },
  {
    table: 'deployments',
    run: (database, term, selected) =>
      fetchDeploymentSuggestions(database, 2, term, selected),
  },
  {
    table: 'engagements',
    run: (database, term, selected) =>
      fetchEngagementSuggestions(database, 2, term, selected),
  },
  {
    table: 'equipment_categories',
    run: (database, term, selected) =>
      fetchEquipmentCategorySuggestions(database, term, 2, selected),
  },
  {
    table: 'equipment_items',
    run: (database, term, selected) =>
      fetchEquipmentItemSuggestions(database, term, 2, selected),
  },
  {
    table: 'equipment_assets',
    run: (database, term, selected) =>
      fetchEquipmentAssetSuggestions(database, term, 2, selected),
  },
]
const rows = [
  { id: 'first', name: 'First', sort_order: 1 },
  { id: 'second', name: 'Second', sort_order: 2 },
  { id: 'selected', name: 'Selected', sort_order: 3 },
  { id: 'last', name: 'Last', sort_order: 4 },
]

describe.each(contracts)('$table suggestion queries', ({ table, run }) => {
  it('keeps the selected option first and limits additional suggestions', async () => {
    const database = createSupabaseMock([{ data: rows, error: null }])
    expect(await run(database.client, 'Unit', 'selected')).toEqual([
      rows[2],
      rows[0],
      rows[1],
    ])
    expect(database.from).toHaveBeenCalledExactlyOnceWith(table)
    expect(database.calls).toContainEqual(
      expect.objectContaining({
        method: 'or',
        args: [expect.stringContaining('id.eq.selected')],
      }),
    )
  })

  it('limits suggestions when a previously selected option no longer exists', async () => {
    const database = createSupabaseMock([{ data: rows, error: null }])
    expect(await run(database.client, 'Unit', 'missing')).toEqual(
      rows.slice(0, 2),
    )
  })

  it('returns ordered unselected results and supports an empty search term', async () => {
    const database = createSupabaseMock([
      { data: rows.slice(0, 2), error: null },
    ])
    expect(await run(database.client, '')).toEqual(rows.slice(0, 2))
    expect(
      database.calls.some(
        (call) => call.method === 'or' || call.method === 'ilike',
      ),
    ).toBe(false)
  })

  it('applies a search expression to nonempty terms', async () => {
    const database = createSupabaseMock([{ data: [], error: null }])
    expect(await run(database.client, 'Unit')).toEqual([])
    expect(
      database.calls.some(
        (call) =>
          (call.method === 'or' || call.method === 'ilike') &&
          call.args.some(
            (value) => typeof value === 'string' && value.includes('Unit'),
          ),
      ),
    ).toBe(true)
  })

  it('returns no suggestions for null data and propagates failed reads', async () => {
    const database = createSupabaseMock([
      { data: null, error: null },
      { data: null, error: { message: 'Read rejected' } },
    ])
    expect(await run(database.client, '')).toEqual([])
    await expect(run(database.client, 'Unit')).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: expect.stringContaining('Read rejected'),
    })
  })
})

describe('battalion suggestion selection', () => {
  const options = {
    term: 'Unit',
    pageSize: 2,
    selectedId: 'selected',
    searchableFields: ['code', 'name'],
  }

  it('loads an inactive selected battalion separately while restricting other choices to active units', async () => {
    const database = createSupabaseMock([
      { data: rows.slice(0, 2), error: null },
      { data: rows[2], error: null },
    ])
    expect(await fetchBattalionSuggestions(database.client, options)).toEqual({
      rows: [rows[2], rows[0], rows[1]],
    })
    expect(database.calls).toContainEqual({
      table: 'battalions',
      method: 'eq',
      args: ['is_active', true],
    })
    expect(database.calls).toContainEqual({
      table: 'battalions',
      method: 'eq',
      args: ['id', 'selected'],
    })
  })

  it('avoids reloading an option already in the result', async () => {
    const database = createSupabaseMock([{ data: rows, error: null }])
    expect(await fetchBattalionSuggestions(database.client, options)).toEqual({
      rows,
    })
    expect(database.from).toHaveBeenCalledOnce()
  })

  it('handles missing selected rows, empty results, and query errors', async () => {
    const database = createSupabaseMock([
      { data: null, error: null },
      { data: null, error: null },
      { data: null, error: { message: 'Offline' } },
    ])
    expect(await fetchBattalionSuggestions(database.client, options)).toEqual({
      rows: [],
    })
    await expect(
      fetchBattalionSuggestions(database.client, options),
    ).rejects.toMatchObject({ statusCode: 500 })
    await expect(
      fetchBattalionSuggestions(database.client, {
        ...options,
        searchableFields: [],
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})

describe('incident lookup suggestions', () => {
  it.each([
    { table: 'incident_types', run: fetchIncidentTypeSuggestions },
    {
      table: 'investigation_statuses',
      run: fetchInvestigationStatusSuggestions,
    },
  ])(
    'loads $table, applies searching, and reports errors',
    async ({ table, run }) => {
      const database = createSupabaseMock([
        { data: rows, error: null },
        { data: null, error: null },
        { data: null, error: { message: 'Offline' } },
      ])
      expect(await run(database.client, 'Unit')).toEqual(rows)
      expect(database.from).toHaveBeenCalledWith(table)
      expect(await run(database.client, '')).toEqual([])
      await expect(run(database.client, '')).rejects.toMatchObject({
        statusCode: 500,
        statusMessage: 'Offline',
      })
    },
  )
})

describe('personnel suggestions', () => {
  it('prioritizes a selected person and exact service number and excludes assigned units', async () => {
    const selected = { id: 'selected', service_number: 'AFP1' }
    const exact = { id: 'exact', service_number: 'AFP2' }
    const other = { id: 'other', service_number: 'AFP3' }
    const database = createSupabaseMock([
      { data: [other, exact, selected], error: null },
    ])
    const response = await fetchPersonnelSuggestions(
      database.client,
      1,
      'first_name.ilike.%Unit%',
      'selected',
      'AFP2',
      'company',
      'battalion',
    )
    expect(response).toEqual({ data: [selected, exact, other], error: null })
    expect(database.calls).toContainEqual({
      table: 'vw_personnel_profile',
      method: 'neq',
      args: ['company_id', 'company'],
    })
    expect(database.calls).toContainEqual({
      table: 'vw_personnel_profile',
      method: 'neq',
      args: ['battalion_id', 'battalion'],
    })
    expect(database.calls).toContainEqual({
      table: 'vw_personnel_profile',
      method: 'limit',
      args: [3],
    })
  })

  it('preserves query errors and handles empty data', async () => {
    const error = { message: 'Offline' }
    const database = createSupabaseMock([{ data: null, error }])
    expect(
      await fetchPersonnelSuggestions(
        database.client,
        2,
        undefined,
        null,
        '',
        null,
        null,
      ),
    ).toEqual({ data: [], error })
  })

  it('includes a person only once when the selected ID also matches the exact service number', async () => {
    const selected = { id: 'selected', service_number: 'AFP1' }
    const other = { id: 'other', service_number: 'AFP2' }
    const database = createSupabaseMock([
      { data: [other, selected], error: null },
    ])
    const response = await fetchPersonnelSuggestions(
      database.client,
      2,
      undefined,
      'selected',
      'AFP1',
      null,
      null,
    )
    expect(response.data).toEqual([selected, other])
  })
})
