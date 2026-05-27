import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { EquipmentItemListApiResponse } from '../../../shared/responses'
import { PERMISSION_CODES } from '../../../shared/constants'
import { mapEquipmentItemListItem, parseManagementPaginationQuery } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { fetchEquipmentItemsByCategoryId } from '../../../utils/equipment-categories/fetchEquipmentItemsByCategoryId'
import { getEquipmentCategoryById } from '../../../utils/equipment-categories/getEquipmentCategoryById'


