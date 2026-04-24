export const FILE_UPLOAD_MAX_SIZE_BYTES = 10 * 1024 * 1024
export const FILE_UPLOAD_ALLOWED_SOURCE_TYPES = ['upload', 'external_url'] as const
export const FILE_UPLOAD_BUCKET_ENV_KEYS = ['SUPABASE_STORAGE_BUCKET', 'DMS_STORAGE_BUCKET', 'GLOBAL_S3_BUCKET'] as const
export const DEFAULT_SUPABASE_STORAGE_BUCKET = 'record-attachments'
export const FILE_UPLOAD_PATH_PREFIX = 'records'
export const EXTERNAL_FILE_ALLOWED_PROTOCOLS = ['http:', 'https:'] as const
export const SUPABASE_STORAGE_S3_REGION_ENV_KEYS = ['REGION', 'AWS_REGION', 'AWS_DEFAULT_REGION'] as const
export const SUPABASE_STORAGE_S3_ENDPOINT_ENV_KEYS = ['SUPABASE_STORAGE_S3_ENDPOINT', 'S3_ENDPOINT'] as const


