import { defineEventHandler, readBody } from 'h3'
import type { UpdateApplicationSettingsRequest } from '../../shared/requests'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { parseApplicationSettingsUpdates } from '../../shared/validations'
import { getCachedApplicationSettings, refreshApplicationSettingsCache } from '../../utils/application-settings/cache'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

