import { describe, expect, it } from 'vitest'
import { parseCalendarEventsQuery } from '../../../../server/shared/validation/domain/calendar'

describe('calendar endpoint queries', () => {
  it('resolves a complete week around the requested date', () => {
    expect(
      parseCalendarEventsQuery({
        mode: 'week',
        date: '2026-08-27',
      }),
    ).toEqual({
      viewMode: 'week',
      rangeStart: '2026-08-23',
      rangeEnd: '2026-08-29',
      hour: null,
    })
  })

  it('allows hour filtering only in day mode', () => {
    expect(
      parseCalendarEventsQuery({
        mode: 'day',
        date: '2026-08-27',
        hour: 14,
      }).hour,
    ).toBe(14)
    expect(() =>
      parseCalendarEventsQuery({
        mode: 'month',
        date: '2026-08-27',
        hour: 14,
      }),
    ).toThrow('Hour filtering is only available in day calendar mode.')
  })
})
