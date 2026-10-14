import { describe, expect, it } from 'vitest'

import {
  assertBattalionExists,
  assertCompanyBelongsToBattalion,
  assertCompanyExists,
} from '@/server/shared/utils/unit-management'
import { assertPersonnelExists } from '@/server/shared/utils/personnel-existence'
import {
  resolvePersonnelBattalionId,
  resolvePersonnelCompanyAssignment,
  resolvePersonnelUnitAssignment,
} from '@/server/shared/utils/personnel-management'
import { createSupabaseMock } from '@/tests/helpers/supabase'

describe.each([
  {
    name: 'personnel',
    table: 'personnel',
    assert: (database: ReturnType<typeof createSupabaseMock>) =>
      assertPersonnelExists({
        supabase: database.client,
        personnelId: 'reference',
        idSelectColumns: 'id',
      }),
  },
  {
    name: 'battalion',
    table: 'battalions',
    assert: (database: ReturnType<typeof createSupabaseMock>) =>
      assertBattalionExists({
        supabase: database.client,
        battalionId: 'reference',
        idSelectColumns: 'id',
      }),
  },
  {
    name: 'company',
    table: 'companies',
    assert: (database: ReturnType<typeof createSupabaseMock>) =>
      assertCompanyExists({
        supabase: database.client,
        companyId: 'reference',
        idSelectColumns: 'id',
      }),
  },
])('$name existence', ({ table, assert }) => {
  it('checks the requested id in its own table', async () => {
    const database = createSupabaseMock([
      { data: { id: 'reference' }, error: null },
    ])
    await expect(assert(database)).resolves.toBeUndefined()
    expect(database.calls).toContainEqual({
      table,
      method: 'eq',
      args: ['id', 'reference'],
    })
  })

  it('distinguishes missing references from database failures', async () => {
    await expect(assert(createSupabaseMock())).rejects.toMatchObject({
      statusCode: 404,
    })
    await expect(
      assert(
        createSupabaseMock([{ data: null, error: { message: 'failed' } }]),
      ),
    ).rejects.toMatchObject({ statusCode: 500 })
  })
})

describe('unit assignment integrity', () => {
  it('requires company membership in the selected battalion', async () => {
    const run = (data: unknown, error: { message: string } | null = null) =>
      assertCompanyBelongsToBattalion({
        supabase: createSupabaseMock([{ data, error }]).client,
        companyId: 'company',
        battalionId: 'battalion',
      })
    await expect(run({ battalion_id: 'battalion' })).resolves.toBeUndefined()
    await expect(run({ battalion_id: 'other' })).rejects.toMatchObject({
      statusCode: 400,
    })
    await expect(run(null)).rejects.toMatchObject({ statusCode: 404 })
    await expect(run(null, { message: 'failed' })).rejects.toMatchObject({
      statusCode: 500,
    })
  })

  it('resolves unit codes after an id lookup misses', async () => {
    const battalion = createSupabaseMock([
      { data: null, error: null },
      { data: { id: 'battalion' }, error: null },
    ])
    await expect(
      resolvePersonnelBattalionId(battalion.client, 'B-01', 'SN-01'),
    ).resolves.toBe('battalion')
    expect(battalion.calls).toContainEqual({
      table: 'battalions',
      method: 'eq',
      args: ['code', 'B-01'],
    })
    const company = createSupabaseMock([
      { data: null, error: null },
      { data: { id: 'company', battalion_id: 'battalion' }, error: null },
    ])
    await expect(
      resolvePersonnelCompanyAssignment(company.client, 'C-01', null, 'SN-01'),
    ).resolves.toEqual({ companyId: 'company', battalionId: 'battalion' })
    await expect(
      resolvePersonnelBattalionId(
        createSupabaseMock().client,
        'missing',
        'SN-01',
      ),
    ).rejects.toMatchObject({ statusCode: 400 })
    await expect(
      resolvePersonnelCompanyAssignment(
        createSupabaseMock().client,
        'missing',
        null,
        'SN-01',
      ),
    ).rejects.toMatchObject({ statusCode: 400 })
  })

  it('uses directly resolved ids without querying fallback codes', async () => {
    const database = createSupabaseMock([
      { data: { id: 'battalion' }, error: null },
      { data: { id: 'company', battalion_id: null }, error: null },
    ])
    await expect(
      resolvePersonnelBattalionId(database.client, 'battalion', 'SN-01'),
    ).resolves.toBe('battalion')
    await expect(
      resolvePersonnelCompanyAssignment(
        database.client,
        'company',
        'selected',
        'SN-01',
      ),
    ).resolves.toEqual({ companyId: 'company', battalionId: 'selected' })
    expect(database.from).toHaveBeenCalledTimes(2)
  })

  it('derives and validates a company battalion and supports unassigned personnel', async () => {
    const database = createSupabaseMock([
      { data: { id: 'company', battalion_id: 'battalion' }, error: null },
      { data: { id: 'battalion' }, error: null },
    ])
    await expect(
      resolvePersonnelUnitAssignment(database.client, {
        companyId: 'company',
        battalionId: null,
      }),
    ).resolves.toEqual({ companyId: 'company', battalionId: 'battalion' })
    const empty = createSupabaseMock()
    await expect(
      resolvePersonnelUnitAssignment(empty.client, {
        companyId: null,
        battalionId: null,
      }),
    ).resolves.toEqual({ companyId: null, battalionId: null })
    expect(empty.from).not.toHaveBeenCalled()
    await expect(
      resolvePersonnelUnitAssignment(empty.client, {
        companyId: 'missing',
        battalionId: null,
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
    await expect(
      resolvePersonnelUnitAssignment(empty.client, {
        companyId: null,
        battalionId: 'missing',
      }),
    ).rejects.toMatchObject({ statusCode: 400 })
  })
})
