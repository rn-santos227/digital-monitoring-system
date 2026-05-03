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
import { createCompany } from '../../utils/companies/createCompany'

export default defineEventHandler(async (event) => {
  const actor = await requirePermission(event, PERMISSION_CODES.companyCreate)
  const body = await readBody<CreateCompanyRequest>(event)
  const payload = parseCreateCompanyPayload(body)
  const supabase = getServiceSupabaseClient()

  try {
    if (payload.battalion_id) {
      const { data: battalion, error: battalionError } = await supabase
        .from('battalions')
        .select(BATTALION_REFERENCE_ID_SELECT_COLUMNS)
        .eq('id', payload.battalion_id)
        .maybeSingle()

      if (battalionError || !battalion) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid battalion id.' })
      }
    }

    const createdId = await createCompany(supabase, payload)

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.companyCreate,
      tableName: 'companies',
      endpoint: AUDIT_LOG_ENDPOINTS.companiesCreate,
      recordId: createdId,
      requestData: body as Record<string, unknown>,
      newData: payload,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Company created successfully.',
    })

    return { ok: true, id: createdId }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.companyCreate,
      tableName: 'companies',
      endpoint: AUDIT_LOG_ENDPOINTS.companiesCreate,
      requestData: body as Record<string, unknown>,
      statusCode: 500,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
