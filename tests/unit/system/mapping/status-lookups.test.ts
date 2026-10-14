import { describe, expect, it } from 'vitest'

import { resolveDeploymentStatusId } from '@/server/shared/utils/deployment-management'
import {
  resolveEquipmentAssetStatusId,
  resolveEquipmentConditionStatusId,
  resolveEquipmentIssuanceStatusId,
  resolveEquipmentServiceabilityStatusId,
} from '@/server/shared/utils/equipment-management'
import {
  resolveEngagementLevelId,
  resolveEngagementStatusId,
  resolveEngagementTypeId,
} from '@/server/shared/utils/engagement-management'
import {
  resolvePersonnelEmploymentStatusId,
  resolvePersonnelServiceStatusId,
} from '@/server/shared/utils/personnel-management'
import {
  resolveTrainingLevelId,
  resolveTrainingStatusId,
} from '@/server/shared/utils/training-management'
import { createSupabaseMock } from '@/tests/helpers/supabase'

describe.each([
  {
    name: 'deployment',
    table: 'deployment_statuses',
    resolve: resolveDeploymentStatusId,
    value: 'Ongoing',
  },
  {
    name: 'asset',
    table: 'asset_statuses',
    resolve: resolveEquipmentAssetStatusId,
    value: 'Available',
  },
  {
    name: 'condition',
    table: 'condition_statuses',
    resolve: resolveEquipmentConditionStatusId,
    value: 'Good',
  },
  {
    name: 'issuance',
    table: 'issuance_statuses',
    resolve: resolveEquipmentIssuanceStatusId,
    value: 'Issued',
  },
  {
    name: 'serviceability',
    table: 'serviceability_statuses',
    resolve: resolveEquipmentServiceabilityStatusId,
    value: 'Serviceable',
  },
  {
    name: 'engagement level',
    table: 'levels',
    resolve: resolveEngagementLevelId,
    value: 'Local',
  },
  {
    name: 'engagement status',
    table: 'engagement_statuses',
    resolve: resolveEngagementStatusId,
    value: 'Planned',
  },
  {
    name: 'employment',
    table: 'employment_statuses',
    resolve: resolvePersonnelEmploymentStatusId,
    value: 'Regular',
  },
  {
    name: 'service',
    table: 'service_statuses',
    resolve: resolvePersonnelServiceStatusId,
    value: 'Active Duty',
  },
  {
    name: 'training level',
    table: 'levels',
    resolve: resolveTrainingLevelId,
    value: 'Local',
  },
  {
    name: 'training status',
    table: 'training_statuses',
    resolve: resolveTrainingStatusId,
    value: 'Planned',
  },
])('$name lookup', ({ table, resolve, value }) => {
  it.each(['name', 'id'] as const)(
    'looks up the supplied %s in the correct table',
    async (field) => {
      const input =
        field === 'id' ? '123e4567-e89b-12d3-a456-426614174000' : value
      const database = createSupabaseMock([
        { data: { id: 'resolved' }, error: null },
      ])
      await expect(resolve(database.client, input)).resolves.toBe('resolved')
      expect(database.calls).toContainEqual({
        table,
        method: 'eq',
        args: [field, input],
      })
    },
  )

  it.each([
    { data: null, error: null },
    { data: {}, error: null },
    { data: null, error: { message: 'failed' } },
  ])('rejects missing or failed lookups with HTTP 400', async (result) => {
    await expect(
      resolve(createSupabaseMock([result]).client, value),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})

describe('engagement category resolution', () => {
  it('uses id first, then falls back to name', async () => {
    const byId = createSupabaseMock([{ data: { id: 'resolved' }, error: null }])
    await expect(resolveEngagementTypeId(byId.client, 'type')).resolves.toBe(
      'resolved',
    )
    expect(byId.from).toHaveBeenCalledTimes(1)
    const byName = createSupabaseMock([
      { data: null, error: null },
      { data: { id: 'resolved' }, error: null },
    ])
    await expect(
      resolveEngagementTypeId(byName.client, 'Exercise'),
    ).resolves.toBe('resolved')
    expect(byName.calls).toContainEqual({
      table: 'engagement_types',
      method: 'eq',
      args: ['name', 'Exercise'],
    })
    await expect(
      resolveEngagementTypeId(createSupabaseMock().client, 'missing'),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})
