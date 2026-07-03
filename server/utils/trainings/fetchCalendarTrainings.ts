import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { CALENDAR_TRAINING_SELECT_COLUMNS } from '../../shared/constants'
import type { CalendarEventsQuery, CalendarTrainingRow } from '../../shared/models'

export async function fetchCalendarTrainings(supabase: SupabaseClient, params: CalendarEventsQuery): Promise<CalendarTrainingRow[]> {
  const { data, error } = await supabase
    .from('trainings')
    .select(CALENDAR_TRAINING_SELECT_COLUMNS)
    .not('start_date', 'is', null)
    .lte('start_date', params.rangeEnd)
    .or(`end_date.gte.${params.rangeStart},end_date.is.null`)
    .order('start_date', { ascending: true, nullsFirst: false })
    .order('training_title', { ascending: true })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch calendar trainings: ${error.message}` })
  }

  return (data ?? []) as CalendarTrainingRow[]
}
