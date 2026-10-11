import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useBackupStore } from '@/app/stores/backup'

describe('backup downloads', () => {
  const request = vi.fn()
  beforeEach(() => {
    setActivePinia(createPinia())
    request.mockReset()
    vi.stubGlobal('fetch', request)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
  })
  afterEach(() => vi.unstubAllGlobals())

  it.each([true, false])(
    'returns backup content with a supplied filename = %s',
    async (withName) => {
      const store = useBackupStore()
      request.mockResolvedValue(
        new Response('{}', {
          headers: withName
            ? { 'content-disposition': 'attachment; filename="backup.json"' }
            : {},
        }),
      )
      const result = await store.download()
      expect(result.fileName).toBe(
        withName ? 'backup.json' : 'digital-afp-monitoring-backup.json',
      )
      expect(await result.blob.text()).toBe('{}')
      expect(store.isDownloading).toBe(false)
      expect(store.hasDownloadError).toBe(false)
    },
  )

  it.each([true, false])(
    'reports failed downloads with valid JSON = %s',
    async (json) => {
      const store = useBackupStore()
      request.mockResolvedValue(
        new Response(json ? '{"statusMessage":"Backup denied"}' : 'invalid', {
          status: 403,
        }),
      )
      await expect(store.download()).rejects.toThrow(
        json ? 'Backup denied' : 'Unable to download the system backup.',
      )
      expect(store.isDownloading).toBe(false)
      expect(store.hasDownloadError).toBe(true)
    },
  )
})
