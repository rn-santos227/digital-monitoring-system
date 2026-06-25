import { createError } from 'h3'
import type {
  CreateEquipmentIncidentRequest,
  UpdateEquipmentIncidentDeploymentRequest,
  UpdateEquipmentIncidentDetailsRequest,
  UpdateEquipmentIncidentEquipmentRequest,
  UpdateEquipmentIncidentLocationRequest,
  UpdateEquipmentIncidentPersonnelRequest,
  UpdateEquipmentIncidentStatusRequest,
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


const buildEquipmentIncidentUpdates = (
  body: Partial<CreateEquipmentIncidentRequest>,
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

  if ('location' in body) {
    updates.location = normalizeOptionalText(body.location ?? undefined) ?? null
  }

  if ('locationLatitude' in body) {
    updates.location_latitude = parseCoordinate(body.locationLatitude, -90, 90, 'Location latitude')
  }

  if ('locationLongitude' in body) {
    updates.location_longitude = parseCoordinate(body.locationLongitude, -180, 180, 'Location longitude')
  }

  if ('description' in body) {
    updates.description = parseRequiredText(body.description, 'Incident description cannot be empty.')
  }

  if ('investigationStatusId' in body) {
    updates.investigation_status_id = normalizeOptionalText(body.investigationStatusId ?? undefined) ?? null
  }

  if ('resolution' in body) {
    updates.resolution = normalizeOptionalText(body.resolution ?? undefined) ?? null
  }

  if ('remarks' in body) {
    updates.remarks = normalizeOptionalText(body.remarks ?? undefined) ?? null
  }

  return updates
}

const assertHasUpdates = (updates: EquipmentIncidentUpdate): EquipmentIncidentUpdate => {
  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  return updates
}

export const buildEquipmentIncidentDetailsUpdates = (
  body: UpdateEquipmentIncidentDetailsRequest,
): EquipmentIncidentUpdate => assertHasUpdates(
  buildEquipmentIncidentUpdates({
    ...(Object.prototype.hasOwnProperty.call(body, 'incidentNo') ? { incidentNo: body.incidentNo } : {}),
    ...(Object.prototype.hasOwnProperty.call(body, 'incidentTypeId') ? { incidentTypeId: body.incidentTypeId } : {}),
    ...(Object.prototype.hasOwnProperty.call(body, 'incidentDate') ? { incidentDate: body.incidentDate } : {}),
    ...(Object.prototype.hasOwnProperty.call(body, 'description') ? { description: body.description } : {}),
)

export const parseEquipmentIncidentListQuery = (query: Record<string, unknown>) => {
  const rawPage = Math.trunc(Number(query.page ?? 1))
  const rawPageSize = Math.trunc(Number(query.pageSize ?? INCIDENT_DEFAULT_PAGE_SIZE))
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1
  const pageSize = Number.isFinite(rawPageSize)
    ? Math.min(Math.max(rawPageSize, 1), INCIDENT_MAX_PAGE_SIZE)
    : INCIDENT_DEFAULT_PAGE_SIZE
  const optionalQueryText = (key: string): string | null => {
    const value = query[key]
    return normalizeOptionalText(typeof value === 'string' ? value : undefined) ?? null
  }

  return {
    page,
    pageSize,
    rangeFrom: (page - 1) * pageSize,
    rangeTo: page * pageSize - 1,
    search: optionalQueryText('search') ?? optionalQueryText('term') ?? '',
    incidentTypeId: optionalQueryText('incidentTypeId'),
    investigationStatusId: optionalQueryText('investigationStatusId'),
    equipmentAssetId: optionalQueryText('equipmentAssetId'),
    personnelId: optionalQueryText('personnelId'),
    deploymentId: optionalQueryText('deploymentId'),
    dateFrom: optionalQueryText('dateFrom'),
    dateTo: optionalQueryText('dateTo'),
  }
}