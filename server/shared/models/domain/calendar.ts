export type CalendarViewMode = 'day' | 'week' | 'month'
export type CalendarEventSource = 'training' | 'engagement'

export interface CalendarEventsQuery {
  viewMode: CalendarViewMode
  rangeStart: string
  rangeEnd: string
  hour: number | null
}
