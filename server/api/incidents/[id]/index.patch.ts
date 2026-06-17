import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateEquipmentIncidentRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import type { EquipmentIncidentCreate } from '../../../shared/models'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  INCIDENT_MUTATION_PERMISSION_CODES,
} from '../../../shared/constants'

