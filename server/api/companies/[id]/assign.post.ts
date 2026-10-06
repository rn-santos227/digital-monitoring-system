import {
  createError,
  defineEventHandler,
  getRouterParam,
  readBody,
} from 'h3'
import type { AssignUnitPersonnelRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import type { PersonnelUpdate } from '../../../shared/models'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../../shared/constants'
import { parseAssignUnitPersonnelPayload, requireRouteId } from '../../../shared/validation'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { getCompanyById } from '../../../utils/companies/getCompanyById'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'
import { getPersonnelById } from '../../../utils/personnel/getPersonnelById'
import { updatePersonnelById } from '../../../utils/personnel/updatePersonnelById'
import { notifyPersonnelAssigned } from '../../../utils/notifications/notifyPersonnelAssigned'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.companyUpdate)
  const companyId = requireRouteId(getRouterParam(event, 'id'), 'Company id is required.')
  const body = await readBody<AssignUnitPersonnelRequest>(event)
  const { personnelId } = parseAssignUnitPersonnelPayload(body)

  const supabase = getServiceSupabaseClient()
  const company = await getCompanyById(supabase, companyId)
  if (!company) {
    throw createError({ statusCode: 404, statusMessage: 'Company not found.' })
  }

  const { data: existingPersonnel, error: existingPersonnelError } = await getPersonnelById(supabase, personnelId)
  if (existingPersonnelError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to fetch personnel details: ${existingPersonnelError.message}` })
  }
  if (!existingPersonnel) {
    throw createError({ statusCode: 404, statusMessage: 'Personnel not found.' })
  }
  if (existingPersonnel.company_id === companyId) {
    throw createError({ statusCode: 409, statusMessage: 'Personnel is already assigned to this company.' })
  }

  const oldData: Record<string, unknown> = {
    personnelId,
    companyId: existingPersonnel.company_id,
    battalionId: existingPersonnel.battalion_id,
  }

  try {
    await executeWithRollback({
      operation: async () => {
        const { error } = await updatePersonnelById(supabase, personnelId, {
          company_id: companyId,
          battalion_id: company.battalion_id,
        } as unknown as Partial<PersonnelUpdate>)
        if (error) {
          throw createError({ statusCode: 500, statusMessage: `Failed to assign company personnel: ${error.message}` })
        }
      },
      rollback: async () => {
        const rollbackResult = await updatePersonnelById(supabase, personnelId, {
          company_id: existingPersonnel.company_id,
          battalion_id: existingPersonnel.battalion_id,
        } as unknown as Partial<PersonnelUpdate>)
        if (rollbackResult.error) {
          throw new Error(rollbackResult.error.message)
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback company personnel assignment changes.', rollbackError)
      },
    })

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.companyUpdate,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.companiesUpdate,
      recordId: personnelId,
      requestData: body as Record<string, unknown>,
      oldData,
      newData: {
        personnelId,
        companyId,
        battalionId: company.battalion_id,
      },
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Company personnel assignment updated successfully.',
    })

    notifyPersonnelAssigned({
      personnelName: existingPersonnel.full_name ?? null,
      personnelCode: existingPersonnel.personnel_code ?? null,
      unitName: company.name,
      unitType: 'company',
      personnelId,
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.companyUpdate,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.companiesUpdate,
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
