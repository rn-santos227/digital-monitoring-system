import { createError, defineEventHandler, readMultipartFormData } from 'h3'
import type { FileUploadResponse } from '../../shared/responses'
import { AUDIT_LOG_ACTIONS, AUDIT_LOG_ENDPOINTS, AUDIT_LOG_OUTCOMES, PERSONNEL_PERMISSION_GROUPS } from '../../shared/constants'
import { buildStorageObjectPath } from '../../shared/utils'
import { validateUploadFilePart } from '../../shared/validations'
import { FILE_UPLOAD_MAX_SIZE_BYTES } from '../../config/storage-s3'
import { resolveSupabaseStorageS3Connection } from '../../config/storage-s3'
import { recordManagementAuditLog } from '../../utils/audit/recordManagementAuditLog'
import { requireAnyPermission } from '../../utils/auth/requireAnyPermission'
import { getServiceSupabaseClient } from '../../utils/auth/serviceClient'
import { getStoragePublicUrl } from '../../utils/files/getStoragePublicUrl'
import { uploadStorageObject } from '../../utils/files/uploadStorageObject'

export default defineEventHandler(async (event): Promise<FileUploadResponse> => {
  const actor = await requireAnyPermission(event, PERSONNEL_PERMISSION_GROUPS.personnelManagement)

  const requestData: Record<string, unknown> = {}

  try {
    const s3Config = resolveSupabaseStorageS3Connection()

    if (!s3Config) {
      throw createError({ statusCode: 500, statusMessage: 'Missing Supabase Storage S3 configuration.' })
    }

    const formData = await readMultipartFormData(event)
    const multipartParts = formData ?? []
    const filePart = multipartParts.find((part) => Boolean(part.filename))

    validateUploadFilePart(filePart, {
      maxSizeBytes: FILE_UPLOAD_MAX_SIZE_BYTES,
    })

    const storagePath = buildStorageObjectPath(filePart.filename)
    const supabase = getServiceSupabaseClient()

    requestData.bucket = s3Config.bucket
    requestData.fileName = filePart.filename
    requestData.mimeType = filePart.type ?? null
    requestData.sizeBytes = filePart.data.length

    await uploadStorageObject(supabase, {
      bucket: s3Config.bucket,
      path: storagePath,
      data: filePart.data,
      contentType: filePart.type ?? undefined,
    })

    const publicUrl = getStoragePublicUrl(supabase, s3Config.bucket, storagePath)

    const response: FileUploadResponse = {
      ok: true,
      sourceType: 'upload',
      message: 'File uploaded successfully.',
      attachment: {
        fileName: filePart.filename,
        mimeType: filePart.type ?? null,
        sizeBytes: filePart.data.length,
        storagePath,
        publicUrl,
      },
    }

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.fileAttachmentCreate,
      tableName: 'storage.objects',
      endpoint: AUDIT_LOG_ENDPOINTS.fileUpload,
      requestData,
      newData: response.attachment,
      statusCode: 201,
      outcome: AUDIT_LOG_OUTCOMES.success,
      message: 'File uploaded to Supabase Storage bucket.',
    })

    return response
  } catch (error: unknown) {
    const statusCode = (error as { statusCode?: number })?.statusCode ?? 500
    const message = error instanceof Error ? error.message : 'Unknown error'

    await recordManagementAuditLog(event, {
      userId: actor.id,
      action: AUDIT_LOG_ACTIONS.fileAttachmentCreate,
      tableName: 'storage.objects',
      endpoint: AUDIT_LOG_ENDPOINTS.fileUpload,
      requestData,
      statusCode,
      outcome: AUDIT_LOG_OUTCOMES.failed,
      message,
    })

    throw error
  }
})
