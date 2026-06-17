import { defineEventHandler } from 'h3'
import type { IncidentKpiResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { fetchIncidentKpiCounts } from '../../utils/incidents/fetchIncidentKpiCounts'


