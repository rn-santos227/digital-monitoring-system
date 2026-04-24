import { createError } from 'h3'
import { EXTERNAL_FILE_ALLOWED_PROTOCOLS } from '../../constants'

export const normalizeFileName = (name: string): string => {
  const normalized = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9._-]/g, '')

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
