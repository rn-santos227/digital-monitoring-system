import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { BattalionEquipmentAssetListResponse } from '../../../shared/responses'
import {
  BATTALION_SUGGESTION_SELECT_COLUMNS,
  UNIT_EQUIPMENT_ASSET_LIST_SELECT_COLUMNS,
  UNIT_PERMISSION_GROUPS,
} from '../../../shared/constants'
import {
  mapUnitEquipmentAssetListItem,
  parseManagementPaginationQuery,
} from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'


