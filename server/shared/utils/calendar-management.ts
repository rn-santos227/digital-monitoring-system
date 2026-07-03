import type {
  CalendarEngagementRow,
  CalendarEventItem,
  CalendarSourceReferenceRow,
  CalendarTrainingRow,
} from '../models'

const toSingleReference = (
  value: CalendarSourceReferenceRow | CalendarSourceReferenceRow[] | null,
): CalendarSourceReferenceRow | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const getCalendarEventHour = (startDate: string): number | null => {
  if (!startDate.includes('T')) {
    return null
  }

  const parsedDate = new Date(startDate)
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.getHours()
}
