import { createError, defineEventHandler, readBody } from 'h3'
import type { CreateCompanyRequest } from '../../shared/requests'
import type { CreateCompanyResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../shared/constants'
import { mapCompanyListItem } from '../../shared/utils'
import { parseCreateCompanyPayload } from '../../shared/validation'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { createCompany } from '../../utils/companies/createCompany'
import { assertBattalionExists } from '../../utils/companies/assertBattalionExists'
import { getCompanyById } from '../../utils/companies/getCompanyById'

export default defineEventHandler(async (event): Promise<CreateCompanyResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.companyCreate)
  const body = await readBody<CreateCompanyRequest>(event)
  const payload = parseCreateCompanyPayload(body)
  const supabase = getServiceSupabaseClient()

  try {
    if (payload.battalion_id) {
      await assertBattalionExists(supabase, payload.battalion_id)
    }

    const createdId = await createCompany(supabase, payload)
    const createdCompany = await getCompanyById(supabase, createdId)

    if (!createdCompany) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created company.' })
    }

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

    return {
      ok: true,
      id: createdId,
      item: mapCompanyListItem(createdCompany),
    }
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
