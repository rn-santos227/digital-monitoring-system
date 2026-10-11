import { createPinia, setActivePinia } from 'pinia'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useNotificationStore } from '@/app/stores/notifications'
import type { NotificationListItem } from '@/app/types/domain/notification'

const item: NotificationListItem = {
  id: 'notice',
  type: 'incident-recorded',
  title: 'Incident',
  message: 'Recorded',
  sourceId: 'incident',
  sourcePath: '/incidents/incident',
  createdAt: '2026-10-04',
  expiresAt: '2026-10-05',
  isRead: false,
}

describe('notification store', () => {
  const request = vi.fn()
  beforeEach(() => {
    setActivePinia(createPinia())
    request.mockReset()
    vi.stubGlobal('$fetch', request)
    vi.stubGlobal('__TEST_NUXT_CLIENT__', false)
  })
  afterEach(() => vi.unstubAllGlobals())

  it('loads notices and accepts replacement stream data', async () => {
    const store = useNotificationStore()
    request.mockResolvedValue({ items: [item], unreadCount: 1 })
    await store.fetchNotifications()
    expect(store.hasUnreadNotifications).toBe(true)
    expect(store.recentNotifications).toEqual([item])
    expect(store.isLoading).toBe(false)
    store.replaceFromStream({ items: [], unreadCount: 0 })
    expect(store.recentNotifications).toEqual([])
    expect(store.hasUnreadNotifications).toBe(false)
  })

  it('marks all notices read only after the API succeeds', async () => {
    const store = useNotificationStore()
    store.replaceFromStream({ items: [item], unreadCount: 1 })
    request.mockResolvedValue({ ok: true })
    await store.markAllRead()
    expect(store.items).toEqual([{ ...item, isRead: true }])
    expect(store.unreadCount).toBe(0)
    expect(store.isMarkingRead).toBe(false)
  })

  it('preserves stream data on fetch or read failure and clears busy state', async () => {
    const store = useNotificationStore()
    store.replaceFromStream({ items: [item], unreadCount: 1 })
    const error = new Error('offline')
    request.mockRejectedValue(error)
    await expect(store.fetchNotifications()).rejects.toBe(error)
    await expect(store.markAllRead()).rejects.toBe(error)
    expect(store.items).toEqual([item])
    expect(store.unreadCount).toBe(1)
    expect(store.isLoading).toBe(false)
    expect(store.isMarkingRead).toBe(false)
  })
})
