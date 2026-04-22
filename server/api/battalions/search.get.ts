import { createError, defineEventHandler, getQuery } from 'h3'
import type { BattalionListResponse } from '../../shared/responses'
import { BATTALION_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapBattalionListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'


