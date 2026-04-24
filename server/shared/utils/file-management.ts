import { createHash, randomUUID } from 'node:crypto'
import {
  DEFAULT_SUPABASE_STORAGE_BUCKET,
  FILE_UPLOAD_BUCKET_ENV_KEYS,
  FILE_UPLOAD_PATH_PREFIX,
} from '../../config/storage-s3'
import { normalizeFileName } from '../validations'

export const resolveStorageBucketName = (): string => {
  for (const key of FILE_UPLOAD_BUCKET_ENV_KEYS) {
    const bucket = process.env[key]?.trim()

    if (bucket) {
      return bucket
    }
  }

  return DEFAULT_SUPABASE_STORAGE_BUCKET
}

export const buildStorageObjectPath = (fileName: string): string => {
  const timestamp = new Date().toISOString().split('T')[0] ?? 'undated'
  const normalizedFileName = normalizeFileName(fileName)
  const id = randomUUID()
  const hash = createHash('sha1').update(`${id}:${normalizedFileName}`).digest('hex').slice(0, 12)

  return `${FILE_UPLOAD_PATH_PREFIX}/${timestamp}/${id}-${hash}-${normalizedFileName}`
}

export const isSupabaseStorageQuotaError = (message: string): boolean => {
  const normalizedMessage = message.toLowerCase()

  return ['quota', 'storage limit', 'insufficient_storage', 'exceeded', 'full'].some((snippet) => normalizedMessage.includes(snippet))
}
