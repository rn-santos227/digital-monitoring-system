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

const hasBytes = (data: Uint8Array, offset: number, expected: readonly number[]): boolean => {
  return expected.every((value, index) => data[offset + index] === value)
}

const hasValidImageSignature = (mimeType: SafeUploadMimeType, data: Uint8Array): boolean => {
  if (mimeType === 'image/jpeg') {
    return data.length >= 4
      && hasBytes(data, 0, [0xff, 0xd8, 0xff])
      && hasBytes(data, data.length - 2, [0xff, 0xd9])
  }

  if (mimeType === 'image/png') {
    return data.length >= 8 && hasBytes(data, 0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
  }

  return data.length >= 12
    && hasBytes(data, 0, [0x52, 0x49, 0x46, 0x46])
    && hasBytes(data, 8, [0x57, 0x45, 0x42, 0x50])
}

const containsActiveContent = (data: Uint8Array): boolean => {
  const decoded = new TextDecoder('utf-8', { fatal: false }).decode(data)

  return UPLOAD_ACTIVE_CONTENT_PATTERN.test(decoded)
}

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
