import { createError, defineEventHandler, readBody } from 'h3'
import type { CreatePersonnelRequest } from '../../shared/requests'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  PERSONNEL_REFERENCE_ID_SELECT_COLUMNS,
} from '../../shared/constants'
import { parseCreatePersonnelPayload } from '../../shared/validations'
import { resolvePersonnelEmploymentStatusId, resolvePersonnelServiceStatusId } from '../../shared/utils'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.personnelCreate)
  const body = await readBody<CreatePersonnelRequest>(event)
  const payload = parseCreatePersonnelPayload(body)

  const supabase = getServiceSupabaseClient()

  try {
    const { data: rank, error: rankError } = await supabase
      .from('ranks')
      .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
      .eq('id', payload.rank_id)
      .maybeSingle()

    if (rankError || !rank) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid rank id.' })
    }

    payload.employment_status_id = await resolvePersonnelEmploymentStatusId(supabase, payload.employment_status_id)
    payload.service_status_id = await resolvePersonnelServiceStatusId(supabase, payload.service_status_id)

    if (payload.company_id) {
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
        .eq('id', payload.company_id)
        .maybeSingle()

      if (companyError || !company) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid company id.' })
      }
    }

    if (payload.battalion_id) {
      const { data: battalion, error: battalionError } = await supabase
        .from('battalions')
        .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
        .eq('id', payload.battalion_id)
        .maybeSingle()

      if (battalionError || !battalion) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid battalion id.' })
      }
    }

    const { data: createdPersonnel, error: insertError } = await supabase
      .from('personnel')
      .insert(payload)
      .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
      .maybeSingle()

    if (insertError || !createdPersonnel?.id) {
      throw createError({ statusCode: 500, statusMessage: `Failed to create personnel record: ${insertError?.message ?? 'Missing id.'}` })
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.personnelCreate,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelCreate,
      recordId: createdPersonnel.id,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Personnel record created successfully.',
    })

    return {
      ok: true,
      id: createdPersonnel.id,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.personnelCreate,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelCreate,
      requestData: body as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
