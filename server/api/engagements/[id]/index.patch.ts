import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdateEngagementRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import type { EngagementUpdate } from '../../../shared/models'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { resolveEngagementLevelId, resolveEngagementStatusId, mapEngagementListItem } from '../../../shared/utils'
import { buildEngagementUpdates, requireRouteId, validateEngagementDateRange } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getEngagementById } from '../../../utils/engagements/getEngagementById'
import { updateEngagementById } from '../../../utils/engagements/updateEngagementById'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.engagementUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Engagement id is required.')
  const body = await readBody<UpdateEngagementRequest>(event)
  const parsedUpdates = buildEngagementUpdates(body)
  if (Object.keys(parsedUpdates).length === 0) throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  const supabase = getServiceSupabaseClient()

  const existingRow = await getEngagementById(supabase, id)
  if (!existingRow) throw createError({ statusCode: 404, statusMessage: 'Engagement not found.' })
  const oldData = { ...mapEngagementListItem(existingRow) }

  validateEngagementDateRange(parsedUpdates.start_date ?? existingRow.start_date, parsedUpdates.end_date ?? existingRow.end_date)
  const updates: EngagementUpdate = {
    engagement_title: parsedUpdates.engagement_title ?? existingRow.engagement_title,
    engagement_type_id: parsedUpdates.engagement_type_id === undefined ? existingRow.engagement_type_id : parsedUpdates.engagement_type_id,
    level_id: parsedUpdates.level_id === undefined ? existingRow.level_id : parsedUpdates.level_id,
    start_date: parsedUpdates.start_date === undefined ? existingRow.start_date : parsedUpdates.start_date,
    end_date: parsedUpdates.end_date === undefined ? existingRow.end_date : parsedUpdates.end_date,
    status_id: parsedUpdates.status_id ?? existingRow.status_id,
    default_remarks: parsedUpdates.default_remarks === undefined ? existingRow.default_remarks : parsedUpdates.default_remarks,
  }

  if (updates.level_id) updates.level_id = await resolveEngagementLevelId(supabase, updates.level_id)
  updates.status_id = await resolveEngagementStatusId(supabase, updates.status_id)

  try {
    await executeWithRollback({
      operation: async () => { await updateEngagementById(supabase, id, updates) },
      rollback: async () => { await updateEngagementById(supabase, id, {
        engagement_title: existingRow.engagement_title,
        engagement_type_id: existingRow.engagement_type_id,
        level_id: existingRow.level_id,
        start_date:existingRow.start_date,
        end_date: existingRow.end_date,
        status_id: existingRow.status_id,
        default_remarks: existingRow.default_remarks
      })},
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback engagement patch API changes.', rollbackError)
      },
    })

    const updatedRow = await getEngagementById(supabase, id)
    const newData = updatedRow
      ? { ...mapEngagementListItem(updatedRow) }
      : oldData

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.engagementUpdate,
      tableName: 'engagements',
      endpoint: AUDIT_LOG_ENDPOINTS.engagementsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: oldData,
      newData,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Engagement updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.engagementUpdate,
      tableName: 'engagements',
      endpoint: AUDIT_LOG_ENDPOINTS.engagementsUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: oldData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
