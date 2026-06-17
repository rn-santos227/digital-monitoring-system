import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateEquipmentIncidentRequest } from '../../shared/requests'
import type { CreateEquipmentIncidentResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  INCIDENT_MUTATION_PERMISSION_CODES,
} from '../../shared/constants'

