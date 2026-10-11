import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  buildSettingsChangeSet,
  toApplicationSettingsAuditRecord,
  toApplicationSettingsItem,
} from '@/server/shared/utils/application-settings'
import { settingsRowFixture } from '@/tests/helpers/settings-row-fixture'
import { createSupabaseMock } from '@/tests/helpers/supabase'

const { serviceClient } = vi.hoisted(() => ({ serviceClient: vi.fn() }))
vi.mock('@/server/utils/auth/serviceClient', () => ({
  getServiceSupabaseClient: serviceClient,
}))

beforeEach(() => {
  vi.resetModules()
  serviceClient.mockReset()
})

describe('application settings mapping and audit changes', () => {
  it('maps database fields for consumers and preserves nullable descriptions and decimal coordinates', () => {
    expect(toApplicationSettingsItem(settingsRowFixture)).toMatchObject({
      id: 'settings',
      appName: 'AFP Monitoring',
      appDescription: null,
      mapDefaultLatitude: 14.6,
      mapDefaultLongitude: 121,
      enableIncidentNotifications: true,
      auditLogRetentionDays: 365,
    })
    expect(toApplicationSettingsAuditRecord(settingsRowFixture)).toEqual(
      settingsRowFixture,
    )
    expect(toApplicationSettingsAuditRecord(settingsRowFixture)).not.toBe(
      settingsRowFixture,
    )
  })

  it('records only changed values including nullable and boolean transitions', () => {
    expect(
      buildSettingsChangeSet(settingsRowFixture, { ...settingsRowFixture }),
    ).toEqual({ changedValues: [] })
    expect(
      buildSettingsChangeSet(settingsRowFixture, {
        ...settingsRowFixture,
        app_description: 'New description',
        page_size: 20,
        enable_incident_notifications: false,
      }),
    ).toEqual({
      changedValues: [
        {
          field: 'app_description',
          oldValue: null,
          newValue: 'New description',
        },
        { field: 'page_size', oldValue: 10, newValue: 20 },
        {
          field: 'enable_incident_notifications',
          oldValue: true,
          newValue: false,
        },
      ],
    })
  })
})

describe('application settings server cache', () => {
  it('fetches the singleton once and explicitly refreshes after updates', async () => {
    const updated = {
      ...settingsRowFixture,
      app_name: 'Updated',
      updated_at: '2026-10-05T00:00:00Z',
    }
    const database = createSupabaseMock([
      { data: settingsRowFixture, error: null },
      { data: updated, error: null },
    ])
    serviceClient.mockReturnValue(database.client)
    const cache = await import('@/server/utils/application-settings/cache')
    expect(await cache.getCachedApplicationSettings()).toEqual(
      settingsRowFixture,
    )
    expect(await cache.getCachedApplicationSettings()).toEqual(
      settingsRowFixture,
    )
    expect(database.from).toHaveBeenCalledTimes(1)
    expect(database.calls).toContainEqual({
      table: 'application_settings',
      method: 'eq',
      args: ['singleton_key', 'default'],
    })
    expect(await cache.refreshApplicationSettingsCache()).toEqual(updated)
    expect(await cache.getCachedApplicationSettings()).toEqual(updated)
    expect(database.from).toHaveBeenCalledTimes(2)
  })

  it.each([
    { data: null, error: null },
    { data: null, error: { message: 'Database unavailable' } },
  ])('retries an unsuccessful initial load', async (result) => {
    const database = createSupabaseMock([
      result,
      { data: settingsRowFixture, error: null },
    ])
    serviceClient.mockReturnValue(database.client)
    const cache = await import('@/server/utils/application-settings/cache')
    await expect(cache.getCachedApplicationSettings()).rejects.toThrow(
      'Failed to fetch application settings',
    )
    expect(await cache.getCachedApplicationSettings()).toEqual(
      settingsRowFixture,
    )
    expect(database.from).toHaveBeenCalledTimes(2)
  })

  it('retains the last valid settings when a refresh fails', async () => {
    const database = createSupabaseMock([
      { data: settingsRowFixture, error: null },
      { data: null, error: { message: 'Offline' } },
    ])
    serviceClient.mockReturnValue(database.client)
    const cache = await import('@/server/utils/application-settings/cache')
    await cache.getCachedApplicationSettings()
    await expect(cache.refreshApplicationSettingsCache()).rejects.toThrow(
      'Offline',
    )
    expect(await cache.getCachedApplicationSettings()).toEqual(
      settingsRowFixture,
    )
  })
})
