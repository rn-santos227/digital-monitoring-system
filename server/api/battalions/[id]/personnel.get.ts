import { createError, defineEventHandler, getQuery, getRouterParam } from 'h3'
import type { BattalionPersonnelListResponse } from '../../../shared/responses'
import {
  BATTALION_PERSONNEL_LIST_SELECT_COLUMNS,
  ID_ONLY_SELECT_COLUMNS,
  UNIT_PERMISSION_GROUPS,
} from '../../../shared/constants'
import {
  assertBattalionExists,
  mapUnitPersonnelListItem,
  parseManagementPaginationQuery,
} from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'


