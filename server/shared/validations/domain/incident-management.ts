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


