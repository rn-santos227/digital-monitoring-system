// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { AUTH_LOCAL_STORAGE_KEYS } from '@/app/constants/api.constants'
import { DASHBOARD_PARAMETERS_STORAGE_KEY } from '@/app/constants/page.constants'
import {
  loadApplicationSettingsFromStorage,
  saveApplicationSettingsToStorage,
  clearApplicationSettingsStorage,
} from '@/app/utils/application-settings-storage'
import {
  normalizeFetchPageSize,
  resolveDefaultFetchPageSize,
} from '@/app/utils/application-settings-page-size'
import {
  normalizeDashboardParameters,
  readDashboardParameters,
  saveDashboardParameters,
  resetDashboardParameters,
} from '@/app/utils/dashboard-parameters-storage'
import { settingsFixture } from '@/tests/helpers/settings-fixture'

describe('settings persistence and defaults', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('__TEST_NUXT_CLIENT__', true)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('round-trips application settings and clears persisted values', () => {
    expect(loadApplicationSettingsFromStorage()).toBeNull()
    saveApplicationSettingsToStorage(settingsFixture)
    expect(loadApplicationSettingsFromStorage()).toEqual(settingsFixture)
    expect(resolveDefaultFetchPageSize()).toBe(10)
    saveApplicationSettingsToStorage({ ...settingsFixture, pageSize: 30 })
    expect(resolveDefaultFetchPageSize()).toBe(30)
    clearApplicationSettingsStorage()
    expect(loadApplicationSettingsFromStorage()).toBeNull()
  })

  it('ignores malformed settings JSON and leaves server rendering free of storage writes', () => {
    localStorage.setItem(
      AUTH_LOCAL_STORAGE_KEYS.applicationSettings,
      '{invalid',
    )
    expect(loadApplicationSettingsFromStorage()).toBeNull()
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
    const write = vi.spyOn(Storage.prototype, 'setItem')
    saveApplicationSettingsToStorage(settingsFixture)
    clearApplicationSettingsStorage()
    expect(loadApplicationSettingsFromStorage()).toBeNull()
    expect(resolveDefaultFetchPageSize()).toBe(10)
    expect(write).not.toHaveBeenCalled()
    write.mockRestore()
  })

  it.each([
    { input: '20', expected: 10 },
    { input: 2.9, expected: 2 },
    { input: 0, expected: 10 },
    { input: 101, expected: 10 },
    { input: undefined, expected: 10 },
    { input: 'invalid', expected: 10 },
  ])('normalizes page size $input', ({ input, expected }) => {
    expect(normalizeFetchPageSize(input)).toBe(expected)
  })

  it('normalizes and persists dashboard limits and restores defaults', () => {
    const defaults = normalizeDashboardParameters()
    expect(readDashboardParameters()).toEqual(defaults)
    const normalized = saveDashboardParameters({
      personnelLimit: 0,
      equipmentLimit: 10.8,
      deploymentLimit: 1e6,
      itemLimit: 1e6,
    })
    expect(normalized.personnelLimit).toBeGreaterThan(0)
    expect(normalized.equipmentLimit).toBe(10)
    expect(normalized.deploymentLimit).toBeLessThan(1e6)
    expect(readDashboardParameters()).toEqual(normalized)
    expect(resetDashboardParameters()).toEqual(defaults)
    expect(localStorage.getItem(DASHBOARD_PARAMETERS_STORAGE_KEY)).toBeNull()
  })

  it('uses dashboard defaults for malformed, non-finite, and server-side input', () => {
    const defaults = normalizeDashboardParameters()
    localStorage.setItem(DASHBOARD_PARAMETERS_STORAGE_KEY, '{invalid')
    expect(readDashboardParameters()).toEqual(defaults)
    expect(
      normalizeDashboardParameters({
        personnelLimit: 'invalid',
        equipmentLimit: Infinity,
      }),
    ).toEqual(defaults)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
    expect(saveDashboardParameters(defaults)).toEqual(defaults)
    expect(readDashboardParameters()).toEqual(defaults)
    expect(resetDashboardParameters()).toEqual(defaults)
    expect(localStorage.getItem(DASHBOARD_PARAMETERS_STORAGE_KEY)).toBe(
      '{invalid',
    )
  })
})
