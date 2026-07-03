import type { CalendarEventsQuery, CalendarViewMode } from '../../models'
import { ISO_DATE_PATTERN } from '../../utils/regex'

const CALENDAR_VIEW_MODES: readonly CalendarViewMode[] = ['day', 'week', 'month']

const isCalendarViewMode = (value: string): value is CalendarViewMode =>
  CALENDAR_VIEW_MODES.includes(value as CalendarViewMode)

const isDateOnly = (value: string): boolean => ISO_DATE_PATTERN.test(value)

const toDateOnly = (date: Date): string => date.toISOString().slice(0, 10)

const parseDateInput = (value: unknown, fallback: Date): Date => {
  if (typeof value !== 'string' || !value.trim()) {
    return fallback
  }

  const normalizedValue = value.trim()
  const parsed = new Date(isDateOnly(normalizedValue) ? `${normalizedValue}T00:00:00Z` : normalizedValue)

  if (Number.isNaN(parsed.getTime())) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid calendar date value.' })
  }

  return parsed
}

const addDays = (date: Date, days: number): Date => {
  const nextDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  nextDate.setUTCDate(nextDate.getUTCDate() + days)
  return nextDate
}

const startOfWeek = (date: Date): Date => addDays(date, -date.getUTCDay())

const startOfMonth = (date: Date): Date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1))

const endOfMonth = (date: Date): Date => new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0))

