import {
  EXTERNAL_FILE_ALLOWED_PROTOCOLS,
  FILE_UPLOAD_ALLOWED_SOURCE_TYPES,
  FILE_UPLOAD_MAX_SIZE_BYTES,
} from '../../../config/storage-s3'

export {
  EXTERNAL_FILE_ALLOWED_PROTOCOLS,
  FILE_UPLOAD_ALLOWED_SOURCE_TYPES,
  FILE_UPLOAD_MAX_SIZE_BYTES,
}

export const SAFE_UPLOAD_IMAGE_TYPES = Object.freeze({
  'image/jpeg': Object.freeze({ extensions: Object.freeze(['jpg', 'jpeg']) }),
  'image/png': Object.freeze({ extensions: Object.freeze(['png']) }),
  'image/webp': Object.freeze({ extensions: Object.freeze(['webp']) }),
} as const)

export const UPLOAD_ACTIVE_CONTENT_PATTERN = /<\s*(?:html|script|svg)|javascript\s*:|on(?:error|load)\s*=|<\?php|<%|#!\//i
