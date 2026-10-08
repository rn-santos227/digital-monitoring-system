import { defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { CalendarEventsResponse } from '../../shared/responses'
import { parseCalendarEventsQuery } from '../../shared/validation'
import { filterCalendarEventsByHour, mapTrainingCalendarEventItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchCalendarTrainings } from '../../utils/trainings/fetchCalendarTrainings'

export default defineEventHandler(async (event): Promise<CalendarEventsResponse> => {
  await requirePermission(event, PERMISSION_CODES.trainingView)
  const calendarQuery = parseCalendarEventsQuery(getQuery(event))
  const supabase = getServiceSupabaseClient()
  const trainingRows = await fetchCalendarTrainings(supabase, calendarQuery)
  const calendarItems = trainingRows.map(mapTrainingCalendarEventItem).filter((item) => item !== null)
  const items = filterCalendarEventsByHour(calendarItems, calendarQuery.hour).sort((left, right) => {
    const dateComparison = left.startDate.localeCompare(right.startDate)
    return dateComparison === 0 ? left.title.localeCompare(right.title) : dateComparison
  })

  return {
    viewMode: calendarQuery.viewMode,
    rangeStart: calendarQuery.rangeStart,
    rangeEnd: calendarQuery.rangeEnd,
    hour: calendarQuery.hour,
    items,
  }
})
