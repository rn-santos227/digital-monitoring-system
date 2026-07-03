import { createError } from 'h3'
import type { SupabaseClient } from '@supabase/supabase-js'
import { CALENDAR_ENGAGEMENT_SELECT_COLUMNS } from '../../shared/constants'
import type { CalendarEngagementRow, CalendarEventsQuery } from '../../shared/models'

