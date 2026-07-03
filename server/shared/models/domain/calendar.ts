export type CalendarViewMode = 'day' | 'week' | 'month'
export type CalendarEventSource = 'training' | 'engagement'

export interface CalendarEventsQuery {
  viewMode: CalendarViewMode
  rangeStart: string
  rangeEnd: string
  hour: number | null
}

export interface CalendarSourceReferenceRow {
  id: string
  name: string
  code?: string
}

export interface CalendarTrainingRow {
  id: string
  training_title: string
  start_date: string | null
  end_date: string | null
  default_remarks: string | null
  training_category: CalendarSourceReferenceRow | CalendarSourceReferenceRow[] | null
  level: CalendarSourceReferenceRow | CalendarSourceReferenceRow[] | null
  training_status: CalendarSourceReferenceRow | CalendarSourceReferenceRow[] | null
}

export interface CalendarEngagementRow {
  id: string
  engagement_title: string
  start_date: string | null
  end_date: string | null
  default_remarks: string | null
  engagement_type: CalendarSourceReferenceRow | CalendarSourceReferenceRow[] | null
  level: CalendarSourceReferenceRow | CalendarSourceReferenceRow[] | null
  engagement_status: CalendarSourceReferenceRow | CalendarSourceReferenceRow[] | null
}


export interface CalendarEventItem {
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
  items: CalendarEventItem[]
}
