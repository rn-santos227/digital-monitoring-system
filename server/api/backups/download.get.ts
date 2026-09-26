import { createError, defineEventHandler, setResponseHeader } from 'h3'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  BACKUP_FILE_PREFIX,
  BACKUP_TABLES,
  PERMISSION_CODES,
} from '../../shared/constants'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { createSystemBackup } from '../../utils/backups/createSystemBackup'

export default defineEventHandler(async (event): Promise<string> => {
  const actor = await requirePermission(event, PERMISSION_CODES.backupDownload)
  const generatedAt = new Date().toISOString()

  try {
   const backup = await createSystemBackup(getServiceSupabaseClient(), generatedAt, actor.id)
    const safeTimestamp = generatedAt.replaceAll(':', '-').replaceAll('.', '-')
    const fileName = `${BACKUP_FILE_PREFIX}-${safeTimestamp}.json`
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unable to create the system backup.'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.backupDownload,
      tableName: 'system_backup',
      endpoint: AUDIT_LOG_ENDPOINTS.backupDownload,
      requestData: { format: 'json' },
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw createError({ statusCode: 500, statusMessage: 'Unable to create the system backup.' })
  }
})
