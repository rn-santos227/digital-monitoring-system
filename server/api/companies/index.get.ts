import { createError, defineEventHandler, getQuery } from 'h3'
import type { CompanyListResponse } from '../../shared/responses'
import { COMPANY_SELECT_COLUMNS, UNIT_PERMISSION_GROUPS } from '../../shared/constants'
import { mapCompanyListItem, parseManagementPaginationQuery } from '../../shared/utils'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'


