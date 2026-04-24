import { API_LOADING_MESSAGES, FILE_MANAGEMENT_API_ENDPOINTS } from '~/constants/api.constants'
import { withApiLoading } from '~/utils/api-request'
import { createSessionHeaders } from '~/utils/auth-session'

export interface FileUploadEndpointResponse {
  ok: true
  sourceType: 'upload' | 'external_url'
  message: string
  attachment: {
    fileName: string
    mimeType: string | null
    sizeBytes: number | null
    storagePath: string | null
    publicUrl: string
  }
}

export interface FileUploadEndpointOptions {
  allowedMimePrefixes?: string[]
}

export const uploadFileEndpoint = async (
  file: File,
  options: FileUploadEndpointOptions = {},
): Promise<FileUploadEndpointResponse> => {
  return await withApiLoading(async () => {
    const formData = new FormData()
    formData.append('file', file)

    const allowedMimePrefixes = options.allowedMimePrefixes ?? []

    if (allowedMimePrefixes.length > 0) {
      formData.append('allowedMimePrefixes', allowedMimePrefixes.join(','))
    }

    return await $fetch<FileUploadEndpointResponse>(FILE_MANAGEMENT_API_ENDPOINTS.upload, {
      method: 'POST',
      headers: createSessionHeaders(),
      body: formData,
    })
  }, API_LOADING_MESSAGES.uploadFile)
}
