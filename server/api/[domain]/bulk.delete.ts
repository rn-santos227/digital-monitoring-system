import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { BulkDeleteApiRequest } from '../../shared/requests'
import type { BulkMutationApiResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
} from '../../shared/constants'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import {
  getBulkDomainDefinition,
  parseBulkIds,
} from '../../shared/utils/bulk-management'
import { assertBulkRowsUnused } from '../../utils/bulk/assertBulkRowsUnused'
import { deleteBulkRows } from '../../utils/bulk/deleteBulkRows'
import { readBulkRows } from '../../utils/bulk/readBulkRows'
import { requireBulkPermission } from '../../utils/bulk/requireBulkPermission'
