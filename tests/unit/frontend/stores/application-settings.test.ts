// @vitest-environment happy-dom
import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useApplicationSettingsStore } from '@/app/stores/application-settings'
import { useGeoMapStore } from '@/app/stores/geomap'
import {
  saveApplicationSettingsToStorage,
  loadApplicationSettingsFromStorage,
} from '@/app/utils/application-settings-storage'
import { settingsFixture } from '@/tests/helpers/settings-fixture'

describe('application settings and map stores', () => {
  const request = vi.fn()
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    request.mockReset()
    vi.stubGlobal('$fetch', request)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', true)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('uses cached settings once without requesting the API', async () => {
    saveApplicationSettingsToStorage(settingsFixture)
    const store = useApplicationSettingsStore()
    await store.initialize()
    await store.initialize()
    expect(store.hasSettings).toBe(true)
    expect(store.hasLoaded).toBe(true)
    expect(store.item).toEqual(settingsFixture)
    expect(request).not.toHaveBeenCalled()
  })

  it('loads uncached settings once and persists them', async () => {
    const store = useApplicationSettingsStore()
    request.mockResolvedValue({ item: settingsFixture })
    await store.initialize()
    expect(store.hasLoaded).toBe(true)
    expect(loadApplicationSettingsFromStorage()).toEqual(settingsFixture)
    await store.initialize()
    expect(request).toHaveBeenCalledTimes(1)
    expect(store.isLoading).toBe(false)
  })

  it('records load errors and allows retrying initialization', async () => {
    const store = useApplicationSettingsStore()
    const error = new Error('offline')
    request.mockRejectedValue(error)
    await expect(store.initialize()).rejects.toBe(error)
    expect(store.hasLoaded).toBe(false)
    expect(store.isLoading).toBe(false)
    expect(store.loadError).toBe('Unable to load application settings.')
    request.mockResolvedValue({ item: settingsFixture })
    await store.initialize()
    expect(store.loadError).toBe('')
  })

  it('replaces settings on update and preserves existing data on failure', async () => {
    const store = useApplicationSettingsStore()
    const payload = {
      ...settingsFixture,
      mapDefaultLatitude: 14.6,
      mapDefaultLongitude: 121,
      pageSize: 25,
    }
    request.mockResolvedValue({ item: payload })
    await store.update(payload)
    expect(store.item?.pageSize).toBe(25)
    expect(store.isSubmitting).toBe(false)
    request.mockRejectedValue(new Error('denied'))
    await expect(store.update(payload)).rejects.toThrow('denied')
    expect(store.item?.pageSize).toBe(25)
    expect(store.updateError).toBe('Unable to update application settings.')
    expect(store.isSubmitting).toBe(false)
  })

  it('synchronizes map coordinates and leaves current settings intact for null input', () => {
    const map = useGeoMapStore()
    const before = { ...map.$state }
    map.syncFromApplicationSettings(null)
    expect(map.$state).toEqual(before)
    map.syncFromApplicationSettings(settingsFixture)
    expect(map.center).toEqual({ latitude: 14.6, longitude: 121 })
    expect(map.defaultZoom).toBe(10)
  })
})
