import type { BaseTabItem } from '~/constants/ui.constants'
import type { CalendarEventTone, CalendarViewMode } from '~/types/domain/calendar'

export const CALENDAR_VIEW_MODE_ITEMS: readonly BaseTabItem[] = Object.freeze([
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
])

export const CALENDAR_VIEW_MODE_LABELS: Record<CalendarViewMode, string> = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
}

export const CALENDAR_WEEKDAY_LABELS = Object.freeze([
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
])
