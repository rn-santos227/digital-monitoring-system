export type FileAttachmentSourceType = 'upload' | 'external_url'

export interface FileUploadExternalUrlRequest {
  sourceType: 'external_url'
  externalUrl: string
}
