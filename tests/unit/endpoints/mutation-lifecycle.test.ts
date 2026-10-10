import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PERMISSION_CODES } from '@/server/shared/constants'
import { createTestEvent } from '@/tests/helpers/h3-event'
import { createSupabaseMock } from '@/tests/helpers/supabase'
import createRank from '@/server/api/ranks/index.post'
import createBattalion from '@/server/api/battalions/index.post'
import createTrainingCategory from '@/server/api/training-categories/index.post'
import deleteRank from '@/server/api/ranks/[id]/index.delete'

const mocks = vi.hoisted(() => ({
  permission: vi.fn(),
  serviceClient: vi.fn(),
  audit: vi.fn(),
  readBody: vi.fn(),
  routeId: vi.fn(),
}))
vi.mock('h3', async (importOriginal) => ({
  ...(await importOriginal<typeof import('h3')>()),
  readBody: mocks.readBody,
  getRouterParam: mocks.routeId,
}))
vi.mock('@/server/utils/auth/requirePermission', () => ({
  requirePermission: mocks.permission,
}))
vi.mock('@/server/utils/auth/serviceClient', () => ({
  getServiceSupabaseClient: mocks.serviceClient,
}))
vi.mock('@/server/utils/audit/recordManagementAuditLog', () => ({
  recordManagementAuditLog: mocks.audit,
}))

beforeEach(() => {
  vi.clearAllMocks()
  mocks.permission.mockResolvedValue({ id: 'actor' })
  mocks.audit.mockReset().mockResolvedValue(undefined)
  mocks.routeId.mockReturnValue('record')
})

describe('create mutation responses and audit outcomes', () => {
  const contracts = [
    {
      name: 'rank',
      table: 'ranks',
      permission: PERMISSION_CODES.rankCreate,
      handler: createRank,
      body: { code: 'SGT', name: 'Sergeant', sortOrder: 2 },
      row: {
        id: 'record',
        code: 'SGT',
        name: 'Sergeant',
        sort_order: 2,
        created_at: 'created',
        updated_at: 'updated',
      },
      separateRead: false,
      display: { code: 'SGT', name: 'Sergeant', sortOrder: 2 },
    },
    {
      name: 'battalion',
      table: 'battalions',
      permission: PERMISSION_CODES.battalionCreate,
      handler: createBattalion,
      body: { code: 'B1', name: 'First Battalion', isActive: true },
      row: {
        id: 'record',
        code: 'B1',
        name: 'First Battalion',
        is_active: true,
        created_at: 'created',
        updated_at: 'updated',
        companies: [],
      },
      separateRead: true,
      display: { code: 'B1', name: 'First Battalion', isActive: true },
    },
    {
      name: 'training category',
      table: 'training_categories',
      permission: PERMISSION_CODES.trainingCreate,
      handler: createTrainingCategory,
      body: { code: 'MED', name: 'Medical' },
      row: {
        id: 'record',
        code: 'MED',
        name: 'Medical',
        created_at: 'created',
        updated_at: 'updated',
      },
      separateRead: true,
      display: { code: 'MED', name: 'Medical' },
    },
  ]

  describe.each(contracts)('$name create API', (contract) => {
    it('enforces the domain permission and returns the created list item with a success audit', async () => {
      const database = createSupabaseMock([
        {
          data: contract.separateRead ? { id: 'record' } : contract.row,
          error: null,
        },
        ...(contract.separateRead ? [{ data: contract.row, error: null }] : []),
      ])
      mocks.serviceClient.mockReturnValue(database.client)
      mocks.readBody.mockResolvedValue(contract.body)
      const event = createTestEvent('/api/test', 'POST')
      const result = await contract.handler(event)
      expect(mocks.permission).toHaveBeenCalledExactlyOnceWith(
        event,
        contract.permission,
      )
      expect(result).toMatchObject({
        ok: true,
        id: 'record',
        item: { id: 'record', ...contract.display },
      })
      expect(database.calls).toContainEqual(
        expect.objectContaining({ table: contract.table, method: 'insert' }),
      )
      expect(mocks.audit).toHaveBeenCalledExactlyOnceWith(
        event,
        expect.objectContaining({
          userId: 'actor',
          tableName: contract.table,
          recordId: 'record',
          statusCode: 201,
          outcome: 'success',
        }),
      )
    })

    it('audits database failures and propagates the error', async () => {
      const database = createSupabaseMock([
        { data: null, error: { message: 'Write rejected' } },
      ])
      mocks.serviceClient.mockReturnValue(database.client)
      mocks.readBody.mockResolvedValue(contract.body)
      const event = createTestEvent('/api/test', 'POST')
      await expect(contract.handler(event)).rejects.toThrow(/Write rejected/)
      expect(mocks.audit).toHaveBeenCalledWith(
        event,
        expect.objectContaining({
          tableName: contract.table,
          statusCode: 500,
          outcome: 'failed',
          message: expect.stringContaining('Write rejected'),
        }),
      )
      expect(database.calls.filter((call) => call.method === 'delete')).toEqual(
        [],
      )
    })
  })

  it('compensates a training category insertion when its success audit fails', async () => {
    const database = createSupabaseMock([
      { data: { id: 'record' }, error: null },
      { data: null, error: null },
    ])
    mocks.serviceClient.mockReturnValue(database.client)
    mocks.readBody.mockResolvedValue({ code: 'MED', name: 'Medical' })
    const error = new Error('Audit unavailable')
    mocks.audit.mockRejectedValueOnce(error)
    const event = createTestEvent('/api/training-categories', 'POST')
    await expect(createTrainingCategory(event)).rejects.toBe(error)
    expect(database.calls).toContainEqual({
      table: 'training_categories',
      method: 'delete',
      args: [],
    })
    expect(database.calls).toContainEqual({
      table: 'training_categories',
      method: 'eq',
      args: ['id', 'record'],
    })
    expect(mocks.audit).toHaveBeenLastCalledWith(
      event,
      expect.objectContaining({
        recordId: 'record',
        outcome: 'failed',
        message: 'Audit unavailable',
      }),
    )
  })

  it('logs a compensation failure while retaining the original mutation error', async () => {
    const database = createSupabaseMock([
      { data: { id: 'record' }, error: null },
      { data: null, error: { message: 'Rollback rejected' } },
    ])
    mocks.serviceClient.mockReturnValue(database.client)
    mocks.readBody.mockResolvedValue({ code: 'MED', name: 'Medical' })
    const original = new Error('Audit unavailable')
    mocks.audit.mockRejectedValueOnce(original)
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      await expect(
        createTrainingCategory(
          createTestEvent('/api/training-categories', 'POST'),
        ),
      ).rejects.toBe(original)
      expect(log).toHaveBeenCalledWith(
        expect.stringContaining('rollback'),
        expect.objectContaining({
          statusMessage: expect.stringContaining('Rollback rejected'),
        }),
      )
    } finally {
      log.mockRestore()
    }
  })
})

describe('rank deletion usage safety', () => {
  it('deletes an unused rank and records its previous values', async () => {
    const row = { id: 'record', code: 'SGT', name: 'Sergeant' }
    const database = createSupabaseMock([
      { data: row, error: null },
      { data: null, error: null, count: 0 },
      { data: null, error: null },
    ])
    mocks.serviceClient.mockReturnValue(database.client)
    const event = createTestEvent('/api/ranks/record', 'DELETE')
    expect(await deleteRank(event)).toEqual({ ok: true })
    expect(mocks.permission).toHaveBeenCalledWith(
      event,
      PERMISSION_CODES.rankDelete,
    )
    expect(database.calls).toContainEqual({
      table: 'ranks',
      method: 'delete',
      args: [],
    })
    expect(mocks.audit).toHaveBeenCalledWith(
      event,
      expect.objectContaining({
        oldData: row,
        outcome: 'success',
        statusCode: 200,
      }),
    )
  })

  it('rejects deletion of a rank assigned to personnel and audits the failed outcome', async () => {
    const database = createSupabaseMock([
      { data: { id: 'record' }, error: null },
      { data: null, error: null, count: 1 },
    ])
    mocks.serviceClient.mockReturnValue(database.client)
    const event = createTestEvent('/api/ranks/record', 'DELETE')
    await expect(deleteRank(event)).rejects.toMatchObject({ statusCode: 409 })
    expect(database.calls.some((call) => call.method === 'delete')).toBe(false)
    expect(mocks.audit).toHaveBeenCalledWith(
      event,
      expect.objectContaining({
        outcome: 'failed',
        message: 'Rank is in use and cannot be deleted.',
      }),
    )
  })

  it('returns 404 without deleting a missing rank', async () => {
    const database = createSupabaseMock([{ data: null, error: null }])
    mocks.serviceClient.mockReturnValue(database.client)
    await expect(
      deleteRank(createTestEvent('/api/ranks/record', 'DELETE')),
    ).rejects.toMatchObject({ statusCode: 404 })
    expect(database.calls.some((call) => call.method === 'delete')).toBe(false)
  })
})
