import { createError } from 'h3'
import type {
  CreateEquipmentIncidentRequest,
  UpdateEquipmentIncidentRequest,
} from '../../requests'
import type {
  EquipmentIncidentCreate,
  EquipmentIncidentUpdate,
} from '../../models'
import {
  ISO_DATE_PATTERN,
  normalizeOptionalText,
} from '../../utils'
import {
  INCIDENT_DEFAULT_PAGE_SIZE,
  INCIDENT_MAX_PAGE_SIZE,
} from '../../constants'

const parseRequiredText = (value: unknown, message: string): string => {
  const normalized = normalizeOptionalText(typeof value === 'string' ? value : undefined)

  if (!normalized) {
    throw createError({ statusCode: 400, statusMessage: message })
  }

  return normalized
}

const parseDate = (value: unknown): string => {
  const date = parseRequiredText(value, 'Incident date is required.')

  if (!ISO_DATE_PATTERN.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    throw createError({ statusCode: 400, statusMessage: 'Incident date must use YYYY-MM-DD format.' })
  }

  return date
}


const parseCoordinate = (
  value: number | string | null | undefined,
  minimum: number,
  maximum: number,
  label: string,
): number | null => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const coordinate = Number(value)

}
