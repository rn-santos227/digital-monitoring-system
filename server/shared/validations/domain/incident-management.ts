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

  if (!Number.isFinite(coordinate) || coordinate < minimum || coordinate > maximum) {
    throw createError({
      statusCode: 400,
      statusMessage: `${label} must be between ${minimum} and ${maximum}.`,
    })
  }

  return coordinate
}

export const parseCreateEquipmentIncidentPayload = (
  body: CreateEquipmentIncidentRequest,
): EquipmentIncidentCreate => ({
  incident_no: parseRequiredText(body.incidentNo, 'Incident number is required.').toUpperCase(),
  equipment_asset_id: parseRequiredText(body.equipmentAssetId, 'Equipment asset is required.'),
  personnel_id: normalizeOptionalText(body.personnelId ?? undefined) ?? null,
  deployment_id: normalizeOptionalText(body.deploymentId ?? undefined) ?? null,
  incident_type_id: parseRequiredText(body.incidentTypeId, 'Incident type is required.'),
  incident_date: parseDate(body.incidentDate),
  location: normalizeOptionalText(body.location ?? undefined) ?? null,
  location_latitude: parseCoordinate(body.locationLatitude, -90, 90, 'Location latitude'),
  location_longitude: parseCoordinate(body.locationLongitude, -180, 180, 'Location longitude'),
  description: parseRequiredText(body.description, 'Incident description is required.'),
  investigation_status_id: normalizeOptionalText(body.investigationStatusId ?? undefined) ?? null,
  resolution: normalizeOptionalText(body.resolution ?? undefined) ?? null,
  remarks: normalizeOptionalText(body.remarks ?? undefined) ?? null,
})


export const buildEquipmentIncidentUpdates = (
  body: UpdateEquipmentIncidentRequest,
): EquipmentIncidentUpdate => {
  const updates: EquipmentIncidentUpdate = {}

  if ('incidentNo' in body) {
    updates.incident_no = parseRequiredText(body.incidentNo, 'Incident number cannot be empty.').toUpperCase()
  }

  if ('equipmentAssetId' in body) {
    updates.equipment_asset_id = parseRequiredText(body.equipmentAssetId, 'Equipment asset cannot be empty.')
  }

  if ('personnelId' in body) {
    updates.personnel_id = normalizeOptionalText(body.personnelId ?? undefined) ?? null
  }

  if ('deploymentId' in body) {
    updates.deployment_id = normalizeOptionalText(body.deploymentId ?? undefined) ?? null
  }

  if ('incidentTypeId' in body) {
    updates.incident_type_id = parseRequiredText(body.incidentTypeId, 'Incident type cannot be empty.')
  }

  if ('incidentDate' in body) {
    updates.incident_date = parseDate(body.incidentDate)
  }

}

