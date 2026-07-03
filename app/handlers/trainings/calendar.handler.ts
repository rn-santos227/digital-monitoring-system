import type { CalendarEventsQuery, CalendarEventsResponse } from '~/types/domain/calendar'
import { TRAINING_CALENDAR_ERROR_MESSAGE } from '~/constants/page.constants'

export const loadTrainingCalendarEventsHandler = async (
  loadCalendarEvents: (query: CalendarEventsQuery) => Promise<CalendarEventsResponse>,
  query: CalendarEventsQuery,
): Promise<CalendarEventsResponse | null> => {
  try {
    return await loadCalendarEvents(query)
  } catch {
    return null
  }
}

export const getTrainingCalendarErrorMessage = (): string => TRAINING_CALENDAR_ERROR_MESSAGE
