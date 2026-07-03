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

export const isSameDay = (left: Date, right: Date): boolean => toDateKey(left) === toDateKey(right)

export const formatCalendarTitle = (date: Date, viewMode: CalendarViewMode): string => {
  if (viewMode === 'day') {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  if (viewMode === 'week') {
    const firstDay = startOfWeek(date)
    const lastDay = addDays(firstDay, 6)
    const monthFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
    return `${monthFormatter.format(firstDay)} – ${monthFormatter.format(lastDay)}, ${lastDay.getFullYear()}`
  }

  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

export const eventOccursOnDate = (event: CalendarEventItem, date: Date): boolean => {
  const currentKey = toDateKey(date)
  const startKey = event.startDate.slice(0, 10)
  const endKey = (event.endDate ?? event.startDate).slice(0, 10)
  return currentKey >= startKey && currentKey <= endKey
}

export const getEventHour = (event: CalendarEventItem): number => {
  const parsed = new Date(event.startDate)
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getHours()
}

export const buildMonthCells = (activeDate: Date, events: CalendarEventItem[]): CalendarDayCell[] => {
  const gridStart = startOfMonthGrid(activeDate)
  const today = new Date()

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index)
    const dateKey = toDateKey(date)

  })
}
