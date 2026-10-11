import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuditStore } from '@/app/stores/audit'
import { auditFixture } from '@/tests/helpers/audit-fixture'

describe('audit store', () => {
  const request = vi.fn()
  beforeEach(() => {
    setActivePinia(createPinia())
    request.mockReset()
    vi.stubGlobal('$fetch', request)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
  })
  afterEach(() => vi.unstubAllGlobals())

  it.each([false, true])(
    'loads paginated audit rows with searching = %s',
    async (searching) => {
      const store = useAuditStore()
      request.mockResolvedValue({
        items: [auditFixture],
        page: 2,
        pageSize: 5,
        totalItems: 8,
        totalPages: 2,
      })
      await store.fetchAuditLogs(
        searching
          ? {
              page: 2,
              pageSize: 5,
              term: ' UPDATE ',
              userName: ' User ',
              fields: 'action',
              startDate: '2026-10-01',
              endDate: '2026-10-04',
            }
          : { page: 2, pageSize: 5 },
      )
      expect(store.hasAuditLogs).toBe(true)
      expect(store.items).toEqual([auditFixture])
      expect(store.totalItems).toBe(8)
      expect(store.isLoading).toBe(false)
      expect(request).toHaveBeenCalledWith(
        searching ? '/api/audit/search' : '/api/audit/logs',
        expect.objectContaining({ method: 'GET' }),
      )
    },
  )

  it('loads selected details and clears them on request', async () => {
    const store = useAuditStore()
    request.mockResolvedValue(auditFixture)
    await store.fetchAuditLogById('audit')
    expect(store.hasSelectedAuditLog).toBe(true)
    expect(store.selectedAuditLog).toEqual(auditFixture)
    expect(store.isDetailLoading).toBe(false)
    store.clearSelectedAuditLog()
    expect(store.hasSelectedAuditLog).toBe(false)
  })

  it.each([new Error('failed'), 'unknown failure'])(
    'clears stale data and records failed reads',
    async (failure) => {
      const store = useAuditStore()
      store.items = [auditFixture]
      store.selectedAuditLog = auditFixture
      request.mockRejectedValue(failure)
      await expect(store.fetchAuditLogs()).rejects.toBe(failure)
      await expect(store.fetchAuditLogById('audit')).rejects.toBe(failure)
      expect(store.items).toEqual([])
      expect(store.selectedAuditLog).toBeNull()
      expect(store.totalItems).toBe(0)
      expect(store.isLoading).toBe(false)
      expect(store.isDetailLoading).toBe(false)
      expect(store.error).toBe(
        failure instanceof Error ? 'failed' : 'Unable to fetch audit logs.',
      )
      expect(store.detailError).toBe(
        failure instanceof Error
          ? 'failed'
          : 'Unable to fetch audit log details.',
      )
    },
  )
})
