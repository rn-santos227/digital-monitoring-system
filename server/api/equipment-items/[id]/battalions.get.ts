import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { EquipmentItemBattalionUsageListApiResponse } from '../../../shared/responses'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapEquipmentItemBattalionUsageListItems, parseManagementPaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchEquipmentItemUsageRows } from '../../../utils/equipment-items/fetchEquipmentItemUsageRows'
import { getEquipmentItemById } from '../../../utils/equipment-items/getEquipmentItemById'


