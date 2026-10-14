import { describe, expect, it } from 'vitest'

import {
  filterCalendarEventsByHour,
  mapEngagementCalendarEventItem,
  mapTrainingCalendarEventItem,
} from '@/server/shared/utils/calendar-management'

const row = {
  id: 'schedule',
  training_title: 'Training',
  engagement_title: 'Engagement',
  start_date: '2026-10-04',
  end_date: null,
  default_remarks: 'Details',
  training_category: [{ name: 'Category' }],
  engagement_type: { name: 'Category' },
  level: [],
  training_status: null,
  engagement_status: null,
}

describe('server calendar event mapping', () => {
  it('maps all-day sources and ignores undated records', () => {
    expect(mapTrainingCalendarEventItem(row)).toMatchObject({
      id: 'training-schedule',
      source: 'training',
      title: 'Training',
      hour: null,
      allDay: true,
      categoryLabel: 'Category',
      levelLabel: null,
    })
    expect(mapEngagementCalendarEventItem(row)).toMatchObject({
      id: 'engagement-schedule',
      source: 'engagement',
      title: 'Engagement',
      allDay: true,
    })
    expect(
      mapTrainingCalendarEventItem({ ...row, start_date: null }),
    ).toBeNull()
    expect(
      mapEngagementCalendarEventItem({ ...row, start_date: null }),
    ).toBeNull()
  })

  it('filters timed events by hour while keeping all-day events', () => {
    const allDay = mapTrainingCalendarEventItem(row)
    const timed = mapEngagementCalendarEventItem({
      ...row,
      start_date: '2026-10-04T09:00:00',
      end_date: '2026-10-04T10:00:00',
    })
    expect(timed).toMatchObject({ hour: 9, allDay: false })
    if (!allDay || !timed) throw new Error('Expected valid calendar fixtures')
    const events = [allDay, timed]
    expect(filterCalendarEventsByHour(events, null)).toBe(events)
    expect(filterCalendarEventsByHour(events, 9)).toEqual(events)
    expect(filterCalendarEventsByHour(events, 10)).toEqual([allDay])
    expect(
      mapTrainingCalendarEventItem({ ...row, start_date: 'invalidT' })?.hour,
    ).toBeNull()
  })
})
