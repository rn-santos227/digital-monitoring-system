import { createError, defineEventHandler, readBody } from 'h3'
import type { CreatePersonnelRequest } from '../../shared/requests'
import type { PersonnelCreate } from '../../shared/models'
import type { CreatePersonnelResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  PERSONNEL_REFERENCE_ID_SELECT_COLUMNS,
} from '../../shared/constants'
import { parseCreatePersonnelPayload } from '../../shared/validations'
import {
  mapPersonnelDetail,
  resolvePersonnelEmploymentStatusId,
  resolvePersonnelServiceStatusId,
  resolvePersonnelUnitAssignment,
} from '../../shared/utils'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { createPersonnel } from '../../utils/personnel/createPersonnel'
import { getPersonnelById } from '../../utils/personnel/getPersonnelById'

export default defineEventHandler(async (event): Promise<CreatePersonnelResponse> => {
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
    payload.company_id
    
    const resolvedAssignment = await resolvePersonnelUnitAssignment(supabase, {
      companyId: payload.company_id ?? null,
      battalionId: payload.battalion_id ?? null,
    })
    payload.company_id = resolvedAssignment.companyId
    payload.battalion_id = resolvedAssignment.battalionId

    const { data: createdPersonnel, error: insertError } = await createPersonnel(supabase, payload as PersonnelCreate)

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

    const { data: createdPersonnelProfile, error: createdPersonnelProfileError } = await getPersonnelById(
      supabase,
      createdPersonnel.id,
    )

    if (createdPersonnelProfileError || !createdPersonnelProfile) {
      throw createError({ statusCode: 500, statusMessage: 'Failed to load created personnel record.' })
    }

    const createdPersonnelDetail = mapPersonnelDetail(createdPersonnelProfile)

    return {
      ok: true,
      id: createdPersonnel.id,
      item: {
        id: createdPersonnelDetail.id,
        personnelCode: createdPersonnelDetail.personnelCode,
        serviceNumber: createdPersonnelDetail.serviceNumber,
        email: createdPersonnelDetail.email,
        fullName: `${createdPersonnelDetail.lastName}, ${createdPersonnelDetail.firstName}${createdPersonnelDetail.middleName ? ` ${createdPersonnelDetail.middleName}` : ''}`,
        rankName: createdPersonnelDetail.rankName,
        companyName: createdPersonnelDetail.companyName,
        battalionName: createdPersonnelDetail.battalionName,
        serviceStatus: createdPersonnelDetail.serviceStatus,
      },
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
