import type { CalendarDayCell, CalendarEventItem, CalendarViewMode } from '~/types/domain/calendar'

const DATE_KEY_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export const toDateKey = (date: Date): string => DATE_KEY_FORMATTER.format(date)

export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate())
