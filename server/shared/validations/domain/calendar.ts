import type { CalendarEventsQuery, CalendarViewMode } from '../../models'
import { ISO_DATE_PATTERN } from '../../utils/regex'

const CALENDAR_VIEW_MODES: readonly CalendarViewMode[] = ['day', 'week', 'month']

const isCalendarViewMode = (value: string): value is CalendarViewMode =>
  CALENDAR_VIEW_MODES.includes(value as CalendarViewMode)

const isDateOnly = (value: string): boolean => ISO_DATE_PATTERN.test(value)

const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10)


