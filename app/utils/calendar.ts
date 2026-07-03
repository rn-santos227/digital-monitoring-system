import type { CalendarDayCell, CalendarEventItem, CalendarViewMode } from '~/types/domain/calendar'

const DATE_KEY_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

