import { describe, expect, it } from 'vitest'

import { fetchBattalionsList } from '@/server/utils/battalions/fetchBattalionsList'
import { fetchCompaniesList } from '@/server/utils/companies/fetchCompaniesList'
import { fetchRanksList } from '@/server/utils/ranks/fetchRanksList'
import { fetchTrainingsList } from '@/server/utils/trainings/fetchTrainingsList'
import { fetchTrainingCategoriesList } from '@/server/utils/training-categories/fetchTrainingCategoriesList'
import { fetchTrainingRecordsList } from '@/server/utils/training-records/fetchTrainingRecordsList'
import { fetchEngagementsList } from '@/server/utils/engagements/fetchEngagementsList'
import { fetchEngagementRecordsList } from '@/server/utils/engagement-records/fetchEngagementRecordsList'
import { fetchDeploymentsList } from '@/server/utils/deployments/fetchDeploymentsList'
import { fetchDeploymentRecordsList } from '@/server/utils/deployment-records/fetchDeploymentRecordsList'
import { fetchEquipmentCategoriesList } from '@/server/utils/equipment-categories/fetchEquipmentCategoriesList'
import { fetchEquipmentItemsList } from '@/server/utils/equipment-items/fetchEquipmentItemsList'
import { fetchEquipmentAssetsList } from '@/server/utils/equipment-assets/fetchEquipmentAssetsList'
import { fetchEquipmentIssuancesList } from '@/server/utils/equipment-issuances/fetchEquipmentIssuancesList'
import { fetchEquipmentIncidentsList } from '@/server/utils/incidents/fetchEquipmentIncidentsList'
import { fetchAccountTypesList } from '@/server/utils/account-types/fetchAccountTypesList'
import { fetchPersonnelList } from '@/server/utils/personnel/fetchPersonnelList'
import { createSupabaseMock } from '@/tests/helpers/supabase'

const params = {
  search: '',
  rangeFrom: 5,
  rangeTo: 9,
  includeInactive: false,
  includeSystem: false,
  battalionId: null,
  incidentTypeId: null,
  investigationStatusId: null,
  equipmentAssetId: null,
  personnelId: null,
  deploymentId: null,
  dateFrom: null,
  dateTo: null,
}

describe.each([
  {
    table: 'battalions',
    run: fetchBattalionsList,
    dataKey: 'rows',
    countKey: 'totalItems',
  },
  {
    table: 'companies',
    run: fetchCompaniesList,
    dataKey: 'data',
    countKey: 'count',
  },
  { table: 'ranks', run: fetchRanksList, dataKey: 'data', countKey: 'count' },
  {
    table: 'trainings',
    run: fetchTrainingsList,
    dataKey: 'data',
    countKey: 'count',
  },
  {
    table: 'training_categories',
    run: fetchTrainingCategoriesList,
    dataKey: 'rows',
    countKey: 'totalItems',
  },
  {
    table: 'training_records',
    run: fetchTrainingRecordsList,
    dataKey: 'rows',
    countKey: 'totalItems',
  },
  {
    table: 'engagements',
    run: fetchEngagementsList,
    dataKey: 'data',
    countKey: 'count',
  },
  {
    table: 'engagement_records',
    run: fetchEngagementRecordsList,
    dataKey: 'rows',
    countKey: 'totalItems',
  },
  {
    table: 'deployments',
    run: fetchDeploymentsList,
    dataKey: 'data',
    countKey: 'count',
  },
  {
    table: 'deployment_records',
    run: fetchDeploymentRecordsList,
    dataKey: 'rows',
    countKey: 'totalItems',
  },
  {
    table: 'equipment_categories',
    run: fetchEquipmentCategoriesList,
    dataKey: 'rows',
    countKey: 'totalItems',
  },
  {
    table: 'equipment_items',
    run: fetchEquipmentItemsList,
    dataKey: 'rows',
    countKey: 'totalItems',
  },
  {
    table: 'equipment_assets',
    run: (
      client: Parameters<typeof fetchEquipmentAssetsList>[0],
      options: typeof params,
    ) =>
      fetchEquipmentAssetsList(
        client,
        options.search,
        options.rangeFrom,
        options.rangeTo,
      ),
    dataKey: 'rows',
    countKey: 'totalItems',
  },
  {
    table: 'equipment_issuances',
    run: fetchEquipmentIssuancesList,
    dataKey: 'rows',
    countKey: 'totalItems',
  },
  {
    table: 'equipment_incidents',
    run: fetchEquipmentIncidentsList,
    dataKey: 'rows',
    countKey: 'totalItems',
  },
  {
    table: 'account_types',
    run: fetchAccountTypesList,
    dataKey: 'rows',
    countKey: 'totalItems',
  },
])('$table list repository', ({ table, run, dataKey, countKey }) => {
  it.each(['', 'Radio'])(
    'returns rows and exact counts with search %s',
    async (search) => {
      const rows = [{ id: 'record' }]
      const database = createSupabaseMock([
        { data: rows, count: 25, error: null },
      ])
      await expect(
        run(database.client, { ...params, search }),
      ).resolves.toMatchObject({ [dataKey]: rows, [countKey]: 25 })
      expect(database.calls).toContainEqual({
        table,
        method: 'range',
        args: [5, 9],
      })
      expect(database.calls).toContainEqual({
        table,
        method: 'select',
        args: [expect.any(String), { count: 'exact' }],
      })
      const filters = database.calls.filter((call) => call.method === 'or')
      expect(filters).toHaveLength(search ? 1 : 0)
      if (search) expect(filters[0]?.args[0]).toContain('Radio')
      expect(
        database.calls.some((call) =>
          ['insert', 'update', 'delete'].includes(call.method),
        ),
      ).toBe(false)
    },
  )

  it('returns an empty collection for missing database rows and counts', async () => {
    await expect(
      run(
        createSupabaseMock([{ data: null, count: null, error: null }]).client,
        params,
      ),
    ).resolves.toMatchObject({ [dataKey]: [], [countKey]: 0 })
  })

  it('propagates database failure as HTTP 500', async () => {
    await expect(
      run(
        createSupabaseMock([
          { data: null, error: { message: 'database offline' } },
        ]).client,
        params,
      ),
    ).rejects.toMatchObject({ statusCode: 500 })
  })
})

describe('filtered unit and incident reads', () => {
  it('filters company scope and can include inactive units and system account types', async () => {
    const database = createSupabaseMock()
    await fetchCompaniesList(database.client, {
      ...params,
      battalionId: 'battalion',
      includeInactive: true,
    })
    expect(database.calls).toContainEqual({
      table: 'companies',
      method: 'eq',
      args: ['battalion_id', 'battalion'],
    })
    expect(database.calls).not.toContainEqual({
      table: 'companies',
      method: 'eq',
      args: ['is_active', true],
    })
    await fetchBattalionsList(database.client, {
      ...params,
      includeInactive: true,
    })
    expect(database.calls).not.toContainEqual({
      table: 'battalions',
      method: 'eq',
      args: ['is_active', true],
    })
    await fetchAccountTypesList(database.client, {
      ...params,
      includeSystem: true,
    })
    expect(database.calls).not.toContainEqual({
      table: 'account_types',
      method: 'eq',
      args: ['is_system', false],
    })
  })

  it('applies all incident reference and date filters', async () => {
    const database = createSupabaseMock()
    await fetchEquipmentIncidentsList(database.client, {
      ...params,
      incidentTypeId: 'type',
      investigationStatusId: 'status',
      equipmentAssetId: 'asset',
      personnelId: 'person',
      deploymentId: 'deployment',
      dateFrom: '2026-10-01',
      dateTo: '2026-10-04',
    })
    for (const [column, value] of [
      ['incident_type_id', 'type'],
      ['investigation_status_id', 'status'],
      ['equipment_asset_id', 'asset'],
      ['personnel_id', 'person'],
      ['deployment_id', 'deployment'],
    ]) {
      expect(database.calls).toContainEqual({
        table: 'equipment_incidents',
        method: 'eq',
        args: [column, value],
      })
    }
    expect(database.calls).toContainEqual({
      table: 'equipment_incidents',
      method: 'gte',
      args: ['incident_date', '2026-10-01'],
    })
    expect(database.calls).toContainEqual({
      table: 'equipment_incidents',
      method: 'lte',
      args: ['incident_date', '2026-10-04'],
    })
  })

  it('returns the personnel query result for the route to interpret', async () => {
    const result = { data: [{ id: 'person' }], count: 1, error: null }
    const database = createSupabaseMock([result, result])
    await expect(fetchPersonnelList(database.client, params)).resolves.toEqual(
      result,
    )
    await fetchPersonnelList(database.client, { ...params, search: 'Officer' })
    expect(database.calls).toContainEqual({
      table: 'vw_personnel_profile',
      method: 'range',
      args: [5, 9],
    })
    expect(
      database.calls.find((call) => call.method === 'or')?.args[0],
    ).toContain('Officer')
  })
})
