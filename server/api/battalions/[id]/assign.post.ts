import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { AssignUnitPersonnelRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import type { PersonnelUpdate } from '../../../shared/models'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERMISSION_CODES } from '../../../shared/constants'
import { parseAssignUnitPersonnelPayload, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getBattalionById } from '../../../utils/battalions/getBattalionById'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getPersonnelById } from '../../../utils/personnel/getPersonnelById'
import { updatePersonnelById } from '../../../utils/personnel/updatePersonnelById'
import { notifyPersonnelAssigned } from '../../../utils/notifications/notifyPersonnelAssigned'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.battalionUpdate)
  const battalionId = requireRouteId(getRouterParam(event, 'id'), 'Battalion id is required.')
  const body = await readBody<AssignUnitPersonnelRequest>(event)
  const { personnelId } = parseAssignUnitPersonnelPayload(body)

  const supabase = getServiceSupabaseClient()
  const battalion = await getBattalionById(supabase, battalionId)
  if (!battalion) {
    throw createError({ statusCode: 404, statusMessage: 'Battalion not found.' })
  }

  const { data: existingPersonnel, error: existingPersonnelError } = await getPersonnelById(supabase, personnelId)
  if (existingPersonnelError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel details: ${existingPersonnelError.message}` })
  }
  if (!existingPersonnel) {
    throw createError({ statusCode: 404, statusMessage: 'Personnel not found.' })
  }
  if (existingPersonnel.battalion_id === battalionId) {
    throw createError({ statusCode: 409, statusMessage: 'Personnel is already assigned to this battalion.' })
  }

  const oldData: Record<string, unknown> = {
    personnelId,
    battalionId: existingPersonnel.battalion_id,
    companyId: existingPersonnel.company_id,
  }

  try {
    await executeWithRollback({
      operation: async () => {
        const { error } = await updatePersonnelById(supabase, personnelId, {
          battalion_id: battalionId,
        } as unknown as Partial<PersonnelUpdate>)
        if (error) {
          throw createError({ statusCode: 500, statusMessage: `Failed to assign battalion personnel: ${error.message}` })
        }
      },
      rollback: async () => {
        const rollbackResult = await updatePersonnelById(supabase, personnelId, {
          battalion_id: existingPersonnel.battalion_id,
          company_id: existingPersonnel.company_id,
        } as unknown as Partial<PersonnelUpdate>)
        if (rollbackResult.error) {
          throw new Error(rollbackResult.error.message)
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback battalion personnel assignment changes.', rollbackError)
      },
    })

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.battalionUpdate,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.battalionsUpdate,
      recordId: personnelId,
      requestData: body as Record<string, unknown>,
      oldData,
      newData: {
        personnelId,
        battalionId,
      },
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Battalion personnel assignment updated successfully.',
    })

    notifyPersonnelAssigned({
      personnelName: existingPersonnel.full_name ?? null,
      personnelCode: existingPersonnel.personnel_code ?? null,
      unitName: battalion.name,
      unitType: 'battalion',
      personnelId,
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.battalionUpdate,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.battalionsUpdate,
      recordId: personnelId,
      requestData: body as Record<string, unknown>,
      oldData,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
