import type { CalendarEventsQuery, CalendarEventsResponse } from '~/types/domain/calendar'
import { ENGAGEMENT_CALENDAR_ERROR_MESSAGE } from '~/constants/page.constants'

export const loadEngagementCalendarEventsHandler = async (
  loadCalendarEvents: (query: CalendarEventsQuery) => Promise<CalendarEventsResponse>,
  query: CalendarEventsQuery,
): Promise<CalendarEventsResponse | null> => {
  try {
    return await loadCalendarEvents(query)
  } catch {
    return null
  }
}

export const getEngagementCalendarErrorMessage = (): string => ENGAGEMENT_CALENDAR_ERROR_MESSAGE
