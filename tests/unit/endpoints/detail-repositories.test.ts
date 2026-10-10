import type { SupabaseClient } from '@supabase/supabase-js'
import { describe, expect, it } from 'vitest'

import { getPersonnelById } from '@/server/utils/personnel/getPersonnelById'
import { getUserProfileById } from '@/server/utils/users/getUserProfileById'
import { getPersonnelServiceStatusById } from '@/server/utils/deployments/getPersonnelServiceStatusById'
import { createSupabaseMock } from '@/tests/helpers/supabase'

type Lookup = (database: SupabaseClient, id: string) => Promise<unknown>
const modules = import.meta.glob<Record<string, Lookup>>(
  '/server/utils/**/*.ts',
)
const contracts = [
  { domain: 'battalions', function: 'getBattalionById', table: 'battalions' },
  {
    domain: 'battalions',
    function: 'getBattalionSuggestionById',
    table: 'battalions',
  },
  { domain: 'companies', function: 'getCompanyById', table: 'companies' },
  {
    domain: 'companies',
    function: 'getCompanySuggestionById',
    table: 'companies',
  },
  { domain: 'ranks', function: 'getRankById', table: 'ranks' },
  { domain: 'ranks', function: 'getRankSuggestionById', table: 'ranks' },
  { domain: 'trainings', function: 'getTrainingById', table: 'trainings' },
  {
    domain: 'trainings',
    function: 'getTrainingSuggestionById',
    table: 'trainings',
  },
  {
    domain: 'training-categories',
    function: 'getTrainingCategoryById',
    table: 'training_categories',
  },
  {
    domain: 'training-records',
    function: 'getTrainingRecordById',
    table: 'training_records',
  },
  {
    domain: 'training-records',
    function: 'getTrainingSourceById',
    table: 'trainings',
  },
  {
    domain: 'deployments',
    function: 'getDeploymentById',
    table: 'deployments',
  },
  {
    domain: 'deployments',
    function: 'getDeploymentSuggestionById',
    table: 'deployments',
  },
  {
    domain: 'deployment-records',
    function: 'getDeploymentRecordById',
    table: 'deployment_records',
  },
  {
    domain: 'deployment-records',
    function: 'getDeploymentSourceById',
    table: 'deployments',
  },
  {
    domain: 'engagements',
    function: 'getEngagementById',
    table: 'engagements',
  },
  {
    domain: 'engagements',
    function: 'getEngagementSuggestionById',
    table: 'engagements',
  },
  {
    domain: 'engagement-records',
    function: 'getEngagementRecordById',
    table: 'engagement_records',
  },
  {
    domain: 'engagement-records',
    function: 'getEngagementSourceById',
    table: 'engagements',
  },
  {
    domain: 'equipment-categories',
    function: 'getEquipmentCategoryById',
    table: 'equipment_categories',
  },
  {
    domain: 'equipment-items',
    function: 'getEquipmentItemById',
    table: 'equipment_items',
  },
  {
    domain: 'equipment-assets',
    function: 'getEquipmentAssetById',
    table: 'equipment_assets',
  },
  {
    domain: 'equipment-issuances',
    function: 'getEquipmentIssuanceById',
    table: 'equipment_issuances',
  },
  {
    domain: 'incidents',
    function: 'getEquipmentIncidentById',
    table: 'equipment_incidents',
  },
  {
    domain: 'account-types',
    function: 'getAccountTypeById',
    table: 'account_types',
    required: true,
  },
  {
    domain: 'account-types',
    function: 'getAccountTypeDetailById',
    table: 'account_types',
    required: true,
  },
]

const loadLookup = async (contract: (typeof contracts)[number]) => {
  const load =
    modules[`/server/utils/${contract.domain}/${contract.function}.ts`]
  if (!load) throw new Error(`Missing lookup module ${contract.function}`)
  const exports = await load()
  const lookup = exports[contract.function]
  if (!lookup) throw new Error(`Missing lookup export ${contract.function}`)
  return lookup
}

describe.each(contracts)('$function persistence boundary', (contract) => {
  it('retrieves the requested row using its domain table and identifier', async () => {
    const database = createSupabaseMock([
      { data: { id: 'record', name: 'Unit' }, error: null },
    ])
    const lookup = await loadLookup(contract)
    expect(await lookup(database.client, 'record')).toEqual({
      id: 'record',
      name: 'Unit',
    })
    expect(database.from).toHaveBeenCalledExactlyOnceWith(contract.table)
    expect(database.calls).toContainEqual({
      table: contract.table,
      method: 'eq',
      args: ['id', 'record'],
    })
    expect(database.calls).toContainEqual({
      table: contract.table,
      method: 'maybeSingle',
      args: [],
    })
  })

  it('handles a missing row according to its public contract', async () => {
    const database = createSupabaseMock([{ data: null, error: null }])
    const lookup = await loadLookup(contract)
    if (contract.required) {
      await expect(lookup(database.client, 'missing')).rejects.toMatchObject({
        statusCode: 404,
      })
    } else {
      expect(await lookup(database.client, 'missing')).toBeNull()
    }
  })

  it('reports database errors instead of treating them as missing records', async () => {
    const database = createSupabaseMock([
      { data: null, error: { message: 'Read rejected' } },
    ])
    const lookup = await loadLookup(contract)
    await expect(lookup(database.client, 'record')).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: expect.stringContaining('Read rejected'),
    })
  })
})

describe('specialized detail lookups', () => {
  it('preserves raw personnel query results for the route to handle', async () => {
    const result = { data: null, error: { message: 'Read rejected' } }
    const database = createSupabaseMock([result])
    expect(await getPersonnelById(database.client, 'personnel')).toEqual(result)
    expect(database.from).toHaveBeenCalledExactlyOnceWith(
      'vw_personnel_profile',
    )
  })

  it('selects requested user-profile columns and distinguishes missing from failed reads', async () => {
    const database = createSupabaseMock([
      { data: { id: 'user', email: 'unit@example.test' }, error: null },
      { data: null, error: null },
      { data: null, error: { message: 'Offline' } },
    ])
    expect(
      await getUserProfileById(
        database.client,
        'user',
        'id,email',
        'Load failed',
      ),
    ).toEqual({ id: 'user', email: 'unit@example.test' })
    expect(database.calls).toContainEqual({
      table: 'user_profiles',
      method: 'select',
      args: ['id,email'],
    })
    await expect(
      getUserProfileById(database.client, 'user', 'id', 'Load failed'),
    ).rejects.toMatchObject({ statusCode: 404 })
    await expect(
      getUserProfileById(database.client, 'user', 'id', 'Load failed'),
    ).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Load failed: Offline',
    })
  })

  it('returns nullable service status identifiers and preserves the supplied error context', async () => {
    const database = createSupabaseMock([
      { data: { service_status_id: 'active' }, error: null },
      { data: null, error: null },
      { data: null, error: { message: 'Offline' } },
    ])
    expect(
      await getPersonnelServiceStatusById(
        database.client,
        'personnel',
        'Status failed',
      ),
    ).toBe('active')
    expect(
      await getPersonnelServiceStatusById(
        database.client,
        'personnel',
        'Status failed',
      ),
    ).toBeNull()
    await expect(
      getPersonnelServiceStatusById(
        database.client,
        'personnel',
        'Status failed',
      ),
    ).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Status failed: Offline',
    })
  })
})
