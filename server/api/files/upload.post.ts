import { createError, defineEventHandler, readMultipartFormData } from 'h3'
import type { FileUploadResponse } from '../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERSONNEL_PERMISSION_GROUPS } from '../../shared/constants'
import { buildStorageObjectPath } from '../../shared/utils'
import { FILE_UPLOAD_MAX_SIZE_BYTES } from '../../config/storage-s3'
import { resolveSupabaseStorageS3Connection } from '../../config/storage-s3'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'


