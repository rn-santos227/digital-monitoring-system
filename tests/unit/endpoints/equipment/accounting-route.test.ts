import { beforeEach, describe, expect, it, vi } from 'vitest'
import handler from '@/server/api/equipment-accounting/index.get'
import { createTestEvent } from '@/tests/helpers/h3-event'

const mocks = vi.hoisted(() => ({ auth: vi.fn(), permission: vi.fn(), client: vi.fn(), fetch: vi.fn() }))
vi.mock('@/server/utils/auth/requireAuth', () => ({ requireAuth: mocks.auth }))
vi.mock('@/server/utils/auth/requireAnyPermission', () => ({ requireAnyPermission: mocks.permission }))
vi.mock('@/server/utils/auth/serviceClient', () => ({ getServiceSupabaseClient: mocks.client }))
vi.mock('@/server/utils/equipment-accounting/fetchEquipmentAccounting', () => ({ fetchEquipmentAccounting: mocks.fetch }))

const subjectId = '11111111-1111-4111-8111-111111111111'

beforeEach(() => {
  vi.resetAllMocks()
  mocks.auth.mockResolvedValue({ id: 'actor' })
  mocks.permission.mockResolvedValue({ id: 'actor' })
  mocks.client.mockReturnValue('database')
  mocks.fetch.mockResolvedValue({
    summary: { assetCount: 21, quantity: 21, unpricedAssetCount: 0, totalValue: 1234.5 },
    items: [], totalItems: 21,
  })
})

describe('equipment accounting API permissions', () => {
  it.each(['personnel', 'company', 'battalion'])('uses %s permissions and returns paginated values', async (subject) => {
    const event = createTestEvent(`/api/equipment-accounting?subject=${subject}&subjectId=${subjectId}&page=2&pageSize=10`)
    const result = await handler(event)
    expect(mocks.permission).toHaveBeenCalledWith(event, [
      `${subject}.view`, `${subject}.create`, `${subject}.update`, `${subject}.delete`,
    ])
    expect(mocks.fetch).toHaveBeenCalledWith('database', subject, subjectId, 10, 19)
    expect(result).toMatchObject({ page: 2, pageSize: 10, totalItems: 21, totalPages: 3 })
  })

  it('blocks a user without the selected scope permission before accessing equipment', async () => {
    const denied = Object.assign(new Error('Access denied'), { statusCode: 403 })
    mocks.permission.mockRejectedValue(denied)
    await expect(handler(createTestEvent(`/api/equipment-accounting?subject=company&subjectId=${subjectId}`))).rejects.toBe(denied)
    expect(mocks.client).not.toHaveBeenCalled()
    expect(mocks.fetch).not.toHaveBeenCalled()
  })

  it('rejects malformed subject ids without opening a database client', async () => {
    await expect(handler(createTestEvent('/api/equipment-accounting?subject=personnel&subjectId=invalid'))).rejects.toMatchObject({ statusCode: 400 })
    expect(mocks.client).not.toHaveBeenCalled()
  })
})
