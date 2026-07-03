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

export const CALENDAR_HOUR_LABELS = Object.freeze(
  Array.from({ length: 24 }, (_, hour) => `${String(hour).padStart(2, '0')}:00`)
)

export const CALENDAR_EVENT_TONE_CLASSES: Record<CalendarEventTone, string> = {
  training: 'border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100',
  engagement: 'border-sky-200 bg-sky-50 text-sky-800 hover:bg-sky-100',
  deployment: 'border-violet-200 bg-violet-50 text-violet-800 hover:bg-violet-100',
  incident: 'border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100',
}

export const CALENDAR_EVENT_DOT_CLASSES: Record<CalendarEventTone, string> = {
  training: 'bg-emerald-500',
  engagement: 'bg-sky-500',
  deployment: 'bg-violet-500',
  incident: 'bg-rose-500',
  neutral: 'bg-slate-400',
}
