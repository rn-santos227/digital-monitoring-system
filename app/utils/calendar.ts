import type { CalendarDayCell, CalendarEventItem, CalendarViewMode } from '~/types/domain/calendar'

const DATE_KEY_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

export const toDateKey = (date: Date): string => DATE_KEY_FORMATTER.format(date)

export const startOfDay = (date: Date): Date => new Date(date.getFullYear(), date.getMonth(), date.getDate())

export const addDays = (date: Date, days: number): Date => {
  const nextDate = startOfDay(date)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate
}

export const startOfWeek = (date: Date): Date => addDays(date, -date.getDay())

export const startOfMonthGrid = (date: Date): Date => startOfWeek(new Date(date.getFullYear(), date.getMonth(), 1))

