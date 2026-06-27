import { defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateEquipmentIncidentEquipmentRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import { INCIDENT_MUTATION_PERMISSION_CODES } from '../../../shared/constants'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { updateEquipmentIncidentEquipment } from '../../../utils/incidents/updateEquipmentIncidentEquipment'


