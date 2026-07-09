import { defineEventHandler, readBody } from 'h3'
import type { UpdateApplicationSettingsRequest } from '../../shared/requests'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../shared/constants'
import { parseApplicationSettingsUpdates } from '../../shared/validations'
import { getCachedApplicationSettings, refreshApplicationSettingsCache } from '../../utils/application-settings/cache'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { buildSettingsChangeSet, toApplicationSettingsAuditRecord, toApplicationSettingsItem } from '../../shared/utils'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.settingsUpdate)
  const body = await readBody<UpdateApplicationSettingsRequest>(event)
  const updates = parseApplicationSettingsUpdates(body)
  const existing = await getCachedApplicationSettings()

  try {
    const supabase = getServiceSupabaseClient()
    const { error } = await supabase
      .from('application_settings')
      .update(updates)
      .eq('singleton_key', 'default')

    if (error) {
      throw new Error(`Failed to update application settings: ${error.message}`)
    }

    const latest = await refreshApplicationSettingsCache()

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.applicationSettingsUpdate,
      tableName: 'application_settings',
      endpoint: AUDIT_LOG_ENDPOINTS.applicationSettingsUpdate,
      recordId: existing.id,
      requestData: {
        updates,
        ...buildSettingsChangeSet(existing, latest),
      },
      oldData: toApplicationSettingsAuditRecord(existing),
      newData: toApplicationSettingsAuditRecord(latest),
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Application settings updated successfully.',
    })

    return { ok: true, item: toApplicationSettingsItem(latest) }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.applicationSettingsUpdate,
      tableName: 'application_settings',
      endpoint: AUDIT_LOG_ENDPOINTS.applicationSettingsUpdate,
      recordId: existing.id,
      requestData: updates,
      oldData: toApplicationSettingsAuditRecord(existing),
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })
    throw error
  }
})
