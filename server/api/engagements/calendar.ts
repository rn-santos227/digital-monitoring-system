import { defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { CalendarEventsResponse } from '../../shared/responses'
import { parseCalendarEventsQuery } from '../../shared/validations'
import { filterCalendarEventsByHour, mapEngagementCalendarEventItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchCalendarEngagements } from '../../utils/engagements/fetchCalendarEngagements'

export default defineEventHandler(async (event): Promise<CalendarEventsResponse> => {
  await requirePermission(event, PERMISSION_CODES.engagementView)

  const calendarQuery = parseCalendarEventsQuery(getQuery(event))
  const supabase = getServiceSupabaseClient()
  const engagementRows = await fetchCalendarEngagements(supabase, calendarQuery)
  const calendarItems = engagementRows.map(mapEngagementCalendarEventItem).filter((item) => item !== null)

  const items = filterCalendarEventsByHour(calendarItems, calendarQuery.hour).sort((left, right) => {
    const dateComparison = left.startDate.localeCompare(right.startDate)
    return dateComparison === 0 ? left.title.localeCompare(right.title) : dateComparison
  })

})
