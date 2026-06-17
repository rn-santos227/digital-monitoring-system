import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { EquipmentIncidentListItem } from '../../../shared/models'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapEquipmentIncidentListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getEquipmentIncidentById } from '../../../utils/incidents/getEquipmentIncidentById'

