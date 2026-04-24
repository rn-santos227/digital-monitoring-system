export const FILE_UPLOAD_MAX_SIZE_BYTES = 10 * 1024 * 1024
export const FILE_UPLOAD_ALLOWED_SOURCE_TYPES = ['upload', 'external_url'] as const
export const FILE_UPLOAD_BUCKET_ENV_KEYS = ['SUPABASE_STORAGE_BUCKET', 'DMS_STORAGE_BUCKET', 'GLOBAL_S3_BUCKET'] as const
export const DEFAULT_SUPABASE_STORAGE_BUCKET = 'record-attachments'
export const FILE_UPLOAD_PATH_PREFIX = 'records'
export const EXTERNAL_FILE_ALLOWED_PROTOCOLS = ['http:', 'https:'] as const
export const SUPABASE_STORAGE_S3_REGION_ENV_KEYS = ['REGION', 'AWS_REGION', 'AWS_DEFAULT_REGION'] as const
export const SUPABASE_STORAGE_S3_ENDPOINT_ENV_KEYS = ['SUPABASE_STORAGE_S3_ENDPOINT', 'S3_ENDPOINT'] as const

export interface SupabaseStorageS3ConnectionConfig {
  endpoint: string
  region: string
  accessKeyId: string
  secretAccessKey: string
  bucket: string
}

export const resolveSupabaseStorageS3Connection = (): SupabaseStorageS3ConnectionConfig | null => {
  const accessKeyId = process.env.S3_PROTOCOL_ACCESS_KEY_ID?.trim() ?? ''
  const secretAccessKey = process.env.S3_PROTOCOL_ACCESS_KEY_SECRET?.trim() ?? ''
  const endpoint = SUPABASE_STORAGE_S3_ENDPOINT_ENV_KEYS
    .map((key) => process.env[key]?.trim() ?? '')
    .find((value) => value.length > 0) ?? ''
  const region = SUPABASE_STORAGE_S3_REGION_ENV_KEYS
    .map((key) => process.env[key]?.trim() ?? '')
    .find((value) => value.length > 0) ?? ''
  const bucket = FILE_UPLOAD_BUCKET_ENV_KEYS
    .map((key) => process.env[key]?.trim() ?? '')
    .find((value) => value.length > 0) ?? ''

  if (!accessKeyId || !secretAccessKey || !region || !endpoint || !bucket) {
    return null
  }

  const normalizedEndpoint = endpoint.replace(/\/+$/, '')

  return {
    endpoint: normalizedEndpoint,
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
  }
}
