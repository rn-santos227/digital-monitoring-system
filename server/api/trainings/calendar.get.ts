import { defineEventHandler, getQuery } from 'h3'
import { PERMISSION_CODES } from '../../shared/constants'
import type { CalendarEventsResponse } from '../../shared/responses'
import { parseCalendarEventsQuery } from '../../shared/validations'
import { filterCalendarEventsByHour, mapTrainingCalendarEventItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchCalendarTrainings } from '../../utils/trainings/fetchCalendarTrainings'


