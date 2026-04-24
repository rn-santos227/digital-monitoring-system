import type { FileAttachmentSourceType } from '../../requests'

export interface FileUploadResponse {
  ok: true
  sourceType: FileAttachmentSourceType
  message: string
  attachment: {
    fileName: string
    mimeType: string | null
    sizeBytes: number | null
    storagePath: string | null
    publicUrl: string
  }
}
