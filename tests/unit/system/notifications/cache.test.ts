import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  NOTIFICATION_CACHE_MAX_ITEMS,
  NOTIFICATION_CACHE_TTL_MS,
} from '@/server/shared/constants/lib/notification'
import { notifications } from '@/server/shared/utils/notification-store'
import { formatNotificationDateRange } from '@/server/shared/utils/notification'
import { isScheduledNotificationStatus } from '@/server/shared/utils/notification-status'
import { createCachedNotification } from '@/server/utils/notifications/createCachedNotification'
import { listCachedNotifications } from '@/server/utils/notifications/listCachedNotifications'
import { listReadableCachedNotifications } from '@/server/utils/notifications/listReadableCachedNotifications'
import { markCachedNotificationsRead } from '@/server/utils/notifications/markCachedNotificationsRead'
import { pruneExpiredNotifications } from '@/server/utils/notifications/pruneExpiredNotifications'

describe('notification cache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-10-04T00:00:00Z'))
    notifications.length = 0
  })

  afterEach(() => {
    notifications.length = 0
    vi.useRealTimers()
  })

  const create = (title = 'Assignment') =>
    createCachedNotification({
      type: 'personnel-assignment',
      title,
      message: 'Test assignment',
    })

  it('stores newest first with a unique id, defaults, and a deterministic expiry', () => {
    const first = create('First')
    const second = createCachedNotification({
      type: 'incident-recorded',
      title: 'Second',
      message: 'Incident',
      sourceId: 'incident',
      sourcePath: '/incidents/incident',
    })

    expect(second.id).not.toBe(first.id)
    expect(first).toMatchObject({
      sourceId: null,
      sourcePath: null,
      readByUserIds: [],
      createdAt: '2026-10-04T00:00:00.000Z',
    })
    expect(Date.parse(first.expiresAt) - Date.parse(first.createdAt)).toBe(
      NOTIFICATION_CACHE_TTL_MS,
    )
    expect(notifications.map((item) => item.title)).toEqual(['Second', 'First'])
  })

  it('bounds the cache and removes expired entries at the exact expiry time', () => {
    for (let index = 0; index <= NOTIFICATION_CACHE_MAX_ITEMS; index += 1)
      create(String(index))
    expect(notifications).toHaveLength(NOTIFICATION_CACHE_MAX_ITEMS)
    expect(notifications.at(-1)?.title).toBe('1')
    vi.advanceTimersByTime(NOTIFICATION_CACHE_TTL_MS - 1)
    pruneExpiredNotifications()
    expect(notifications).toHaveLength(NOTIFICATION_CACHE_MAX_ITEMS)
    vi.advanceTimersByTime(1)
    expect(listCachedNotifications()).toEqual([])
  })

  it('isolates list results and marks each user once', () => {
    create()
    markCachedNotificationsRead('user-a')
    markCachedNotificationsRead('user-a')
    markCachedNotificationsRead('user-b')
    const copy = listCachedNotifications()
    const item = copy[0]
    expect(item?.readByUserIds).toEqual(['user-a', 'user-b'])
    if (item) {
      item.title = 'Changed copy'
      item.readByUserIds.push('user-c')
    }
    expect(notifications[0]?.title).toBe('Assignment')
    expect(notifications[0]?.readByUserIds).toEqual(['user-a', 'user-b'])
  })

  it('filters schedule notifications by domain permissions', () => {
    create()
    createCachedNotification({
      type: 'training-schedule',
      title: 'Training',
      message: '',
    })
    createCachedNotification({
      type: 'engagement-schedule',
      title: 'Engagement',
      message: '',
    })

    expect(
      listReadableCachedNotifications([]).map((item) => item.title),
    ).toEqual(['Assignment'])
    expect(
      listReadableCachedNotifications(['training.view']).map(
        (item) => item.title,
      ),
    ).toEqual(['Training', 'Assignment'])
    expect(
      listReadableCachedNotifications(['engagement.view']).map(
        (item) => item.title,
      ),
    ).toEqual(['Engagement', 'Assignment'])
  })

  it.each([
    ['2026-01-01', '2026-01-02', '2026-01-01 to 2026-01-02'],
    ['2026-01-01', null, '2026-01-01'],
    [null, '2026-01-02', '2026-01-02'],
    [null, null, 'No schedule date set'],
  ])('formats schedule %s / %s', (start, end, expected) => {
    expect(formatNotificationDateRange(start, end)).toBe(expected)
  })

  it.each([
    [null, false],
    ['Scheduled', true],
    ['Rescheduled', true],
    ['Completed', false],
  ] as const)('recognizes scheduled status %s', (status, expected) => {
    expect(isScheduledNotificationStatus(status)).toBe(expected)
  })
})
