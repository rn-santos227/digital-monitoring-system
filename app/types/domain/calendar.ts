export type CalendarViewMode = 'day' | 'week' | 'month'
export type CalendarEventSource = 'training' | 'engagement'

export interface CalendarEventsQuery {
  mode?: CalendarViewMode
  viewMode?: CalendarViewMode
  date?: string
  startDate?: string
  endDate?: string
  rangeStart?: string
  rangeEnd?: string
  hour?: number | null
}

