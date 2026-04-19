import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import type { UpdatePersonnelRequest } from '../../../shared/requests'
import type { MutationSuccessResponse } from '../../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  PERSONNEL_PROFILE_SUMMARY_SELECT_COLUMNS,
  PERSONNEL_REFERENCE_ID_SELECT_COLUMNS,
} from '../../../shared/constants'
import { buildPersonnelUpdates, ensurePersonnelUnitAssignmentAfterUpdate, requireRouteId } from '../../../shared/validations'
import { recordManagementAuditLog } from '../../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../../utils/auth/serviceClient'
import { executeWithRollback } from '../../../utils/db/executeWithRollback'

export default defineEventHandler(async (event): Promise<MutationSuccessResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.personnelUpdate)
  const id = requireRouteId(getRouterParam(event, 'id'), 'Personnel id is required.')
  const body = await readBody<UpdatePersonnelRequest>(event)

  const updates = buildPersonnelUpdates(body)

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  const supabase = getServiceSupabaseClient()
  const { data: existingPersonnel, error: existingPersonnelError } = await supabase
    .from('personnel')
    .select(PERSONNEL_PROFILE_SUMMARY_SELECT_COLUMNS)
    .eq('id', id)
    .maybeSingle()

  if (existingPersonnelError) {
    throw createError({ statusCode: 500, statusMessage: `Failed to read personnel record: ${existingPersonnelError.message}` })
  }

  if (!existingPersonnel) {
    throw createError({ statusCode: 404, statusMessage: 'Personnel record not found.' })
  }

  ensurePersonnelUnitAssignmentAfterUpdate(existingPersonnel.company_id, existingPersonnel.battalion_id, updates)

  try {
    if (typeof updates.rank_id === 'string') {
      const { data: rank } = await supabase
        .from('ranks')
        .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
        .eq('id', updates.rank_id)
        .maybeSingle()

      if (!rank) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid rank id.' })
      }
    }

    if (typeof updates.employment_status_id === 'string') {
      const { data: employmentStatus } = await supabase
        .from('employment_statuses')
        .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
        .eq('id', updates.employment_status_id)
        .maybeSingle()

      if (!employmentStatus) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid employment status id.' })
      }
    }

    if (typeof updates.service_status_id === 'string') {
      const { data: serviceStatus } = await supabase
        .from('service_statuses')
        .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
        .eq('id', updates.service_status_id)
        .maybeSingle()

      if (!serviceStatus) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid service status id.' })
      }
    }

    if (typeof updates.company_id === 'string') {
      const { data: company } = await supabase
        .from('companies')
        .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
        .eq('id', updates.company_id)
        .maybeSingle()

      if (!company) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid company id.' })
      }
    }

    if (typeof updates.battalion_id === 'string') {
      const { data: battalion } = await supabase
        .from('battalions')
        .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
        .eq('id', updates.battalion_id)
        .maybeSingle()

      if (!battalion) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid battalion id.' })
      }
    }

    await executeWithRollback({
      operation: async () => {
        const { error: updateError } = await supabase
          .from('personnel')
          .update(updates)
          .eq('id', id)

        if (updateError) {
          throw createError({ statusCode: 500, statusMessage: `Failed to update personnel record: ${updateError.message}` })
        }
      },
      rollback: async () => {
        const { error: rollbackError } = await supabase
          .from('personnel')
          .update({
            personnel_code: existingPersonnel.personnel_code,
            service_number: existingPersonnel.service_number,
            last_name: existingPersonnel.last_name,
            first_name: existingPersonnel.first_name,
            middle_name: existingPersonnel.middle_name,
            sex: existingPersonnel.sex,
            birthdate: existingPersonnel.birthdate,
            rank_id: existingPersonnel.rank_id,
            company_id: existingPersonnel.company_id,
            battalion_id: existingPersonnel.battalion_id,
            employment_status_id: existingPersonnel.employment_status_id,
            service_status_id: existingPersonnel.service_status_id,
            contact_number: existingPersonnel.contact_number,
            date_enlisted: existingPersonnel.date_enlisted,
          })
          .eq('id', id)

        if (rollbackError) {
          throw rollbackError
        }
      },
      onRollbackError: (rollbackError) => {
        console.error('Failed to rollback personnel patch API changes.', rollbackError)
      },
    })

    const { data: updatedPersonnel } = await supabase
      .from('personnel')
      .select(PERSONNEL_PROFILE_SUMMARY_SELECT_COLUMNS)
      .eq('id', id)
      .maybeSingle()

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.personnelUpdate,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingPersonnel,
      newData: updatedPersonnel ?? existingPersonnel,
      statusCode: 200,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Personnel record updated successfully.',
    })

    return { ok: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.personnelUpdate,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelUpdate,
      recordId: id,
      requestData: body as Record<string, unknown>,
      oldData: existingPersonnel,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
