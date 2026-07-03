export type CalendarViewMode = 'day' | 'week' | 'month'
export type CalendarEventSource = 'training' | 'engagement'
export type CalendarEventTone = CalendarEventSource | 'deployment' | 'incident' | 'neutral'

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

export interface CalendarEventsResponse {
  viewMode: CalendarViewMode
  rangeStart: string
  rangeEnd: string
  hour: number | null
  items: DomainCalendarEventItem[]
}

export interface DomainCalendarState {
  items: DomainCalendarEventItem[]
  isLoading: boolean
  error: string
  lastQuery: CalendarEventsQuery | null
}

export interface CalendarEventItem {
  id: string
  title: string
  startDate: string
  endDate?: string | null
  allDay?: boolean
  tone?: CalendarEventTone
  categoryLabel?: string | null
  description?: string | null
  location?: string | null
}

export interface CalendarDayCell {
  key: string
  date: Date
  dateKey: string
  dayNumber: number
  isToday: boolean
  isCurrentMonth: boolean
  events: CalendarEventItem[]
}
