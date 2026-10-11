import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  addDays,
  buildMonthCells,
  eventOccursOnDate,
  formatCalendarTitle,
  getEventHour,
  isSameDay,
  startOfDay,
  startOfMonthGrid,
  startOfWeek,
  toDateKey,
} from '@/app/utils/calendar'
import type { CalendarEventItem } from '@/app/types/domain/calendar'

const event = {
  id: 'training',
  startDate: '2026-10-04T09:00:00',
  endDate: '2026-10-06T09:00:00',
} as CalendarEventItem

describe('calendar dates and event placement', () => {
  afterEach(() => vi.useRealTimers())

  it('uses local date keys and returns fresh normalized dates', () => {
    const date = new Date(2026, 9, 4, 15, 30)
    expect(toDateKey(date)).toBe('2026-10-04')
    expect(startOfDay(date)).toEqual(new Date(2026, 9, 4))
    expect(addDays(date, -4)).toEqual(new Date(2026, 8, 30))
    expect(date.getHours()).toBe(15)
    expect(isSameDay(date, new Date(2026, 9, 4))).toBe(true)
    expect(isSameDay(date, new Date(2026, 9, 5))).toBe(false)
  })

  it('starts weeks on Sunday and includes the leading days in a month grid', () => {
    expect(startOfWeek(new Date(2026, 9, 7))).toEqual(new Date(2026, 9, 4))
    expect(startOfMonthGrid(new Date(2026, 9, 20))).toEqual(
      new Date(2026, 8, 27),
    )
  })

  it('formats day, week, and month titles', () => {
    expect(formatCalendarTitle(new Date(2026, 9, 4), 'day')).toBe(
      'Sunday, October 4, 2026',
    )
    expect(formatCalendarTitle(new Date(2026, 9, 4), 'week')).toContain('Oct 4')
    expect(formatCalendarTitle(new Date(2026, 9, 4), 'month')).toBe(
      'October 2026',
    )
  })

  it('includes range endpoints and treats missing end dates as single-day events', () => {
    expect(eventOccursOnDate(event, new Date(2026, 9, 4))).toBe(true)
    expect(eventOccursOnDate(event, new Date(2026, 9, 6))).toBe(true)
    expect(eventOccursOnDate(event, new Date(2026, 9, 7))).toBe(false)
    expect(
      eventOccursOnDate({ ...event, endDate: null }, new Date(2026, 9, 5)),
    ).toBe(false)
    expect(getEventHour(event)).toBe(9)
    expect(getEventHour({ ...event, startDate: 'invalid' })).toBe(0)
  })

  it('builds exactly six weeks with today, month membership, and matching events', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 9, 4, 12))
    const cells = buildMonthCells(new Date(2026, 9, 1), [event])
    expect(cells).toHaveLength(42)
    expect(cells[0]).toMatchObject({
      dateKey: '2026-09-27',
      isCurrentMonth: false,
    })
    expect(
      cells.filter((cell) => cell.isToday).map((cell) => cell.dateKey),
    ).toEqual(['2026-10-04'])
    expect(
      cells.filter((cell) => cell.events.length).map((cell) => cell.dateKey),
    ).toEqual(['2026-10-04', '2026-10-05', '2026-10-06'])
  })
})
