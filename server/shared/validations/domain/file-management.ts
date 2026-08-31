import { createError } from 'h3'
import {
  EXTERNAL_FILE_ALLOWED_PROTOCOLS,
  SAFE_UPLOAD_IMAGE_TYPES,
  UPLOAD_ACTIVE_CONTENT_PATTERN,
} from '../../constants'
import { normalizeWhitespaceToken, stripUnsafeFileNameCharacters } from '../../utils'

interface MultipartPart {
  name?: string
  data?: Uint8Array
  filename?: string
  type?: string
}

interface UploadFileValidationOptions {
  maxSizeBytes: number
}

type SafeUploadMimeType = keyof typeof SAFE_UPLOAD_IMAGE_TYPES

export const normalizeFileName = (name: string): string => {
  const normalized = stripUnsafeFileNameCharacters(normalizeWhitespaceToken(name, '-').toLowerCase())

  if (!normalized) {
    return 'attachment'
  }

  return normalized
}

export const parseExternalAttachmentUrl = (value: unknown): URL => {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'External URL is required.' })
  }

  let parsedUrl: URL

  try {
    parsedUrl = new URL(value)
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'External URL is invalid.' })
  }

  if (!EXTERNAL_FILE_ALLOWED_PROTOCOLS.includes(parsedUrl.protocol as (typeof EXTERNAL_FILE_ALLOWED_PROTOCOLS)[number])) {
    throw createError({ statusCode: 400, statusMessage: 'External URL protocol is not allowed.' })
  }

  return parsedUrl
}

export function validateUploadFilePart(
  filePart: MultipartPart | undefined,
  options: UploadFileValidationOptions,
): asserts filePart is Required<Pick<MultipartPart, 'data' | 'filename'>> & MultipartPart {
  if (!filePart?.data || !filePart.filename) {
    throw createError({ statusCode: 400, statusMessage: 'File payload is required.' })
  }

  if (filePart.data.length > options.maxSizeBytes) {
    throw createError({ statusCode: 413, statusMessage: 'File size exceeds the maximum allowed upload size.' })
  }

  const normalizedMimeType = filePart.type?.trim().toLowerCase() ?? ''

  const safeType = SAFE_UPLOAD_IMAGE_TYPES[normalizedMimeType as SafeUploadMimeType]
  const extension = filePart.filename.split('.').pop()?.toLowerCase() ?? ''

  if (!safeType || !safeType.extensions.some((allowedExtension) => allowedExtension === extension)) {
    throw createError({
      statusCode: 415,
      statusMessage: 'Only JPEG, PNG, and WebP images with matching file extensions are allowed.',
    })
  }

  if (!hasValidImageSignature(normalizedMimeType as SafeUploadMimeType, filePart.data)) {
    throw createError({ statusCode: 415, statusMessage: 'File contents do not match the declared image type.' })
  }

  if (containsActiveContent(filePart.data)) {
    throw createError({ statusCode: 415, statusMessage: 'Files containing active or executable content are not allowed.' })
  }
}
