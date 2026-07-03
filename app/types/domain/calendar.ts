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

export interface DomainCalendarEventItem {
  id: string
  source: CalendarEventSource
  sourceId: string
  title: string
  startDate: string
  endDate: string | null
  hour: number | null
  allDay: boolean
  tone: CalendarEventSource
  categoryLabel: string | null
  statusLabel: string | null
  levelLabel: string | null
  description: string | null
}
