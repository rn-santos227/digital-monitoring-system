import { beforeEach, describe, expect, it, vi } from 'vitest'

import handler from '@/server/api/application-settings/index.patch'
import { PERMISSION_CODES } from '@/server/shared/constants'
import { settingsRowFixture } from '@/tests/helpers/settings-row-fixture'
import { createSupabaseMock } from '@/tests/helpers/supabase'
import { createTestEvent } from '@/tests/helpers/h3-event'

const mocks = vi.hoisted(() => ({
  permission: vi.fn(),
  body: vi.fn(),
  existing: vi.fn(),
  refresh: vi.fn(),
  audit: vi.fn(),
  client: vi.fn(),
}))
vi.mock('h3', async (importOriginal) => ({
  ...(await importOriginal<typeof import('h3')>()),
  readBody: mocks.body,
}))
vi.mock('@/server/utils/auth/requirePermission', () => ({
  requirePermission: mocks.permission,
}))
vi.mock('@/server/utils/auth/serviceClient', () => ({
  getServiceSupabaseClient: mocks.client,
}))
vi.mock('@/server/utils/audit/recordManagementAuditLog', () => ({
  recordManagementAuditLog: mocks.audit,
}))
vi.mock('@/server/utils/application-settings/cache', () => ({
  getCachedApplicationSettings: mocks.existing,
  refreshApplicationSettingsCache: mocks.refresh,
}))

beforeEach(() => {
  vi.clearAllMocks()
  mocks.permission.mockResolvedValue({ id: 'actor' })
  mocks.body.mockResolvedValue({ appName: ' Updated name ', pageSize: 20 })
  mocks.existing.mockResolvedValue(settingsRowFixture)
  mocks.refresh.mockResolvedValue({
    ...settingsRowFixture,
    app_name: 'Updated name',
    page_size: 20,
  })
  mocks.audit.mockResolvedValue(undefined)
})

describe('application settings mutation API', () => {
  it('normalizes singleton updates, refreshes the cache, and audits changed values', async () => {
    const database = createSupabaseMock([{ data: null, error: null }])
    mocks.client.mockReturnValue(database.client)
    const event = createTestEvent('/api/application-settings', 'PATCH')
    expect(await handler(event)).toMatchObject({
      ok: true,
      item: { appName: 'Updated name', pageSize: 20 },
    })
    expect(mocks.permission).toHaveBeenCalledWith(
      event,
      PERMISSION_CODES.settingsUpdate,
    )
    expect(database.calls).toContainEqual({
      table: 'application_settings',
      method: 'update',
      args: [{ app_name: 'Updated name', page_size: 20 }],
    })
    expect(database.calls).toContainEqual({
      table: 'application_settings',
      method: 'eq',
      args: ['singleton_key', 'default'],
    })
    expect(mocks.refresh).toHaveBeenCalledOnce()
    expect(mocks.audit).toHaveBeenCalledWith(
      event,
      expect.objectContaining({
        outcome: 'success',
        oldData: settingsRowFixture,
        requestData: expect.objectContaining({
          changedValues: expect.arrayContaining([
            { field: 'page_size', oldValue: 10, newValue: 20 },
          ]),
        }),
      }),
    )
  })

  it('records a failed database update without refreshing the cache', async () => {
    const database = createSupabaseMock([
      { data: null, error: { message: 'Write rejected' } },
    ])
    mocks.client.mockReturnValue(database.client)
    const event = createTestEvent('/api/application-settings', 'PATCH')
    await expect(handler(event)).rejects.toThrow('Write rejected')
    expect(mocks.refresh).not.toHaveBeenCalled()
    expect(mocks.audit).toHaveBeenCalledWith(
      event,
      expect.objectContaining({
        outcome: 'failed',
        statusCode: 500,
        oldData: settingsRowFixture,
      }),
    )
  })

  it('rejects empty update payloads before obtaining a mutation client', async () => {
    mocks.body.mockResolvedValue({})
    await expect(
      handler(createTestEvent('/api/application-settings', 'PATCH')),
    ).rejects.toMatchObject({ statusCode: 400 })
    expect(mocks.client).not.toHaveBeenCalled()
  })
})
