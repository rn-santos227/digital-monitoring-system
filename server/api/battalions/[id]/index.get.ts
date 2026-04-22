import { createError, defineEventHandler, getRouterParam } from 'h3'
import type { BattalionDetailResponse } from '../../../shared/responses'
import { BATTALION_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../../shared/constants'
import { mapBattalionListItem } from '../../../shared/utils'
import { requireRouteId } from '../../../shared/validations'
import { requireAnyPermission } from '../../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'

