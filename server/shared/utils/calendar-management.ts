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

