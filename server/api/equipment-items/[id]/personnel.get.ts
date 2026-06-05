import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { EquipmentItemPersonnelUsageListApiResponse } from '../../../shared/responses'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapEquipmentItemPersonnelUsageListItem, parseManagementPaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchEquipmentItemPersonnelUsage } from '../../../utils/equipment-items/fetchEquipmentItemPersonnelUsage'
import { getEquipmentItemById } from '../../../utils/equipment-items/getEquipmentItemById'


