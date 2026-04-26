import { createError, defineEventHandler, readMultipartFormData } from 'h3'
import type { PersonnelBatchUploadResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
  PERSONNEL_REFERENCE_ID_SELECT_COLUMNS,
} from '../../shared/constants'
import { parseCreatePersonnelPayload, validateUploadFilePart } from '../../shared/validations'
import {
  assertCompanyBelongsToBattalion,
  parsePersonnelBatchUploadWorkbook,
  resolvePersonnelEmploymentStatusId,
  resolvePersonnelServiceStatusId,
} from '../../shared/utils'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'

const EXCEL_MIME_PREFIXES = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']

export default defineEventHandler(async (event): Promise<PersonnelBatchUploadResponse> => {
  const actor = await requirePermission(event, PERMISSION_CODES.personnelCreate)
  const requestData: Record<string, unknown> = {}

  try {
    const formData = await readMultipartFormData(event)
    const multipartParts = formData ?? []
    const filePart = multipartParts.find((part) => Boolean(part.filename))

    validateUploadFilePart(filePart, {
      maxSizeBytes: 10 * 1024 * 1024,
      allowedMimePrefixes: EXCEL_MIME_PREFIXES,
    })

    requestData.fileName = filePart.filename
    requestData.fileSize = filePart.data.length

    const parsedRows = await parsePersonnelBatchUploadWorkbook(filePart.data)

    if (parsedRows.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid personnel rows were found in the uploaded Excel file.' })
    }

    const supabase = getServiceSupabaseClient()
    let insertedCount = 0

    for (const row of parsedRows) {
      const payload = parseCreatePersonnelPayload({
        ...row,
        dateEnlisted: row.dateEnlisted ?? new Date().toISOString().slice(0, 10),
      })

      const { data: rank, error: rankError } = await supabase
        .from('ranks')
        .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
        .eq('id', payload.rank_id)
        .maybeSingle()

      if (rankError || !rank) {
        const { data: rankByCode, error: rankByCodeError } = await supabase
          .from('ranks')
          .select(PERSONNEL_REFERENCE_ID_SELECT_COLUMNS)
          .eq('code', payload.rank_id)
          .maybeSingle()

        if (rankByCodeError || !rankByCode) {
          throw createError({ statusCode: 400, statusMessage: `Invalid rank value for service number ${payload.service_number}.` })
        }

        payload.rank_id = rankByCode.id
      }

      payload.employment_status_id = await resolvePersonnelEmploymentStatusId(supabase, payload.employment_status_id)
      payload.service_status_id = await resolvePersonnelServiceStatusId(supabase, payload.service_status_id)

      if (payload.battalion_id) {
        const { data: battalionById } = await supabase
          .from('battalions')
          .select('id')
          .eq('id', payload.battalion_id)
          .maybeSingle()

        if (!battalionById) {
          const { data: battalionByCode, error: battalionByCodeError } = await supabase
            .from('battalions')
            .select('id')
            .eq('code', payload.battalion_id)
            .maybeSingle()

          if (battalionByCodeError || !battalionByCode) {
            throw createError({ statusCode: 400, statusMessage: `Invalid battalion value for service number ${payload.service_number}.` })
          }

          payload.battalion_id = battalionByCode.id
        }
      }

      if (payload.company_id) {
        const { data: companyById } = await supabase
          .from('companies')
          .select('id,battalion_id')
          .eq('id', payload.company_id)
          .maybeSingle()

        if (!companyById) {
          const { data: companyByCode, error: companyByCodeError } = await supabase
            .from('companies')
            .select('id,battalion_id')
            .eq('code', payload.company_id)
            .maybeSingle()

          if (companyByCodeError || !companyByCode) {
            throw createError({ statusCode: 400, statusMessage: `Invalid company value for service number ${payload.service_number}.` })
          }

          payload.company_id = companyByCode.id
          payload.battalion_id = payload.battalion_id ?? companyByCode.battalion_id ?? null
        } else {
          payload.battalion_id = payload.battalion_id ?? companyById.battalion_id ?? null
        }
      }

      if (payload.company_id && payload.battalion_id) {
        await assertCompanyBelongsToBattalion({
          supabase,
          companyId: payload.company_id,
          battalionId: payload.battalion_id,
        })
      }

      const { error: insertError } = await supabase
        .from('personnel')
        .insert(payload)

      if (insertError) {
        throw createError({ statusCode: 500, statusMessage: `Failed to create personnel record for ${payload.service_number}: ${insertError.message}` })
      }

      insertedCount += 1
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.personnelCreate,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelBatchUpload,
      requestData,
      newData: { insertedCount },
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'Personnel batch upload completed successfully.',
    })

    return {
      ok: true,
      insertedCount,
    }
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.personnelCreate,
      tableName: 'personnel',
      endpoint: AUDIT_LOG_ENDPOINTS.personnelBatchUpload,
      requestData,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
