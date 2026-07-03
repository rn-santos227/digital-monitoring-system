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

const isCalendarEventAllDay = (startDate: string, endDate: string | null): boolean =>
  !startDate.includes('T') && (!endDate || !endDate.includes('T'))

export const mapTrainingCalendarEventItem = (row: CalendarTrainingRow): CalendarEventItem | null => {
  if (!row.start_date) {
    return null
  }

  const category = toSingleReference(row.training_category)
  const level = toSingleReference(row.level)
  const status = toSingleReference(row.training_status)

  return {
    id: `training-${row.id}`,
    source: 'training',
    sourceId: row.id,
    title: row.training_title,
    startDate: row.start_date,
    endDate: row.end_date,
    hour: getCalendarEventHour(row.start_date),
    allDay: isCalendarEventAllDay(row.start_date, row.end_date),
    tone: 'training',
    categoryLabel: category?.name ?? null,
    statusLabel: status?.name ?? null,
    levelLabel: level?.name ?? null,
    description: row.default_remarks,
  }
}
