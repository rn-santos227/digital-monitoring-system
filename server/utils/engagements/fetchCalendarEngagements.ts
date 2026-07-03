import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { CALENDAR_ENGAGEMENT_SELECT_COLUMNS } from '../../shared/constants'
import type { CalendarEngagementRow, CalendarEventsQuery } from '../../shared/models'

export async function fetchCalendarEngagements(supabase: SupabaseClient, params: CalendarEventsQuery): Promise<CalendarEngagementRow[]> {
  const { data, error } = await supabase
    .from('engagements')
    .select(CALENDAR_ENGAGEMENT_SELECT_COLUMNS)
    .not('start_date', 'is', null)
    .lte('start_date', params.rangeEnd)
    .or(`end_date.gte.${params.rangeStart},end_date.is.null`)
    .order('start_date', { ascending: true, nullsFirst: false })
    .order('engagement_title', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch calendar engagements: ${error.message}` })
  }

  return (data ?? []) as CalendarEngagementRow[]
}
