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
