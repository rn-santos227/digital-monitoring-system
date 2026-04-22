import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateCompanyRequest } from '../../shared/requests'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  BATTALION_REFERENCE_ID_SELECT_COLUMNS,
  PERMISSION_CODES,
} from '../../shared/constants'
import { parseCreateCompanyPayload } from '../../shared/validations'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'


