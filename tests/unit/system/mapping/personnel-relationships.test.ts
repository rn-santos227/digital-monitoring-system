import { describe, expect, it } from 'vitest'

import { PERSONNEL_RELATIONSHIP_REFERENCE_DEFINITIONS } from '@/server/shared/constants'
import {
  getPersonnelReferenceCount,
  getPersonnelRelationshipCounts,
  mapPersonnelRelationshipCountsResponse,
} from '@/server/shared/utils/personnel-relationships'
import { createSupabaseMock } from '@/tests/helpers/supabase'

describe('personnel relationship safety checks', () => {
  it('counts references across every configured table and column', async () => {
    const database = createSupabaseMock(
      PERSONNEL_RELATIONSHIP_REFERENCE_DEFINITIONS.map((_, index) => ({
        data: null,
        error: null,
        count: index === 0 ? 2 : 0,
      })),
    )
    const relationships = await getPersonnelRelationshipCounts({
      supabase: database.client,
      personnelId: 'personnel',
    })
    expect(relationships).toHaveLength(
      PERSONNEL_RELATIONSHIP_REFERENCE_DEFINITIONS.length,
    )
    for (const definition of PERSONNEL_RELATIONSHIP_REFERENCE_DEFINITIONS) {
      expect(database.calls).toContainEqual({
        table: definition.table,
        method: 'eq',
        args: [definition.column, 'personnel'],
      })
      expect(database.calls).toContainEqual({
        table: definition.table,
        method: 'select',
        args: ['id', { count: 'exact', head: true }],
      })
    }
    const response = mapPersonnelRelationshipCountsResponse(relationships)
    expect(response.totalReferences).toBe(2)
    expect(response.hasReferences).toBe(true)
    expect(response.breakdown[0]?.isReferenced).toBe(true)
    expect(
      response.breakdown.slice(1).every((item) => !item.isReferenced),
    ).toBe(true)
  })

  it('provides zero counts for missing relationships and null database counts', async () => {
    const database = createSupabaseMock([
      { data: null, error: null, count: null },
    ])
    expect(
      await getPersonnelReferenceCount({
        supabase: database.client,
        table: 'training_records',
        column: 'personnel_id',
        id: 'personnel',
      }),
    ).toBe(0)
    expect(mapPersonnelRelationshipCountsResponse([])).toMatchObject({
      trainingRecords: 0,
      deploymentRecords: 0,
      deploymentSupervisions: 0,
      equipmentIssuancesReceived: 0,
      totalReferences: 0,
      hasReferences: false,
      breakdown: [],
    })
  })

  it('fails closed when the database cannot verify references', async () => {
    const database = createSupabaseMock([
      { data: null, error: { message: 'Unavailable' } },
    ])
    await expect(
      getPersonnelReferenceCount({
        supabase: database.client,
        table: 'training_records',
        column: 'personnel_id',
        id: 'personnel',
      }),
    ).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'Failed to check training_records references: Unavailable',
    })
  })
})
