import { createError } from 'h3'
import { EXTERNAL_FILE_ALLOWED_PROTOCOLS } from '../../constants'
import { normalizeWhitespaceToken, stripUnsafeFileNameCharacters } from '../../utils'

interface MultipartPart {
  name?: string
  data?: Uint8Array
  filename?: string
  type?: string
}

interface UploadFileValidationOptions {
  maxSizeBytes: number
  allowedMimePrefixes?: string[]
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

export const parseMultipartTextField = (parts: MultipartPart[], fieldName: string): string | null => {
  const fieldPart = parts.find((part) => part.name === fieldName && !part.filename)

  if (!fieldPart?.data) {
    return null
  }

  const value = new TextDecoder().decode(fieldPart.data).trim()
  return value.length > 0 ? value : null
}

export const parseAllowedMimePrefixes = (parts: MultipartPart[]): string[] => {
  const rawValue = parseMultipartTextField(parts, 'allowedMimePrefixes')

  if (!rawValue) {
    return []
  }

  return rawValue
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter((value) => value.length > 0)
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

  if ((options.allowedMimePrefixes?.length ?? 0) === 0) {
    return
  }

  const normalizedMimeType = filePart.type?.trim().toLowerCase() ?? ''

  if (!normalizedMimeType) {
    throw createError({ statusCode: 415, statusMessage: 'File type is required for this upload.' })
  }

  const isAllowed = (options.allowedMimePrefixes ?? []).some((prefix) => normalizedMimeType.startsWith(prefix))

  if (!isAllowed) {
    throw createError({ statusCode: 415, statusMessage: 'File type is not allowed for this upload.' })
  }
}
