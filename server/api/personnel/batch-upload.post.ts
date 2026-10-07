import { createError, defineEventHandler, readMultipartFormData } from 'h3'
import type { PersonnelBatchUploadResponse } from '../../shared/responses'
import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENDPOINTS,
  AUDIT_LOG_OUTCOMES,
  PERMISSION_CODES,
} from '../../shared/constants'
import { validateUploadFilePart } from '../../shared/validation'
import { parsePersonnelBatchUploadWorkbook } from '../../shared/utils'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { processPersonnelBatchUpload } from '../../utils/personnel/processPersonnelBatchUpload'

const EXCEL_MIME_PREFIXES = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
const EXCEL_FILE_EXTENSIONS = ['xlsx']
const ZIP_FILE_SIGNATURE = [0x50, 0x4b, 0x03, 0x04]

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
      allowedExtensions: EXCEL_FILE_EXTENSIONS,
      requiredSignature: ZIP_FILE_SIGNATURE,
    })

    requestData.fileName = filePart.filename
    requestData.fileSize = filePart.data.length

    const parsedRows = await parsePersonnelBatchUploadWorkbook(filePart.data)

    if (parsedRows.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No valid personnel rows were found in the uploaded Excel file.' })
    }

    const supabase = getServiceSupabaseClient()
    const insertedCount = await processPersonnelBatchUpload(supabase, parsedRows)

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
