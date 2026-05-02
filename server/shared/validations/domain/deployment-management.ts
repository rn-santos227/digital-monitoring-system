import { createError } from 'h3'
import type {
  CreateDeploymentRequest,
  CreateDeploymentRecordFromDeploymentRequest,
  CreateDeploymentRecordRequest,
  UpdateDeploymentRequest,
  UpdateDeploymentRecordRequest,
} from '../../requests'
import { normalizeOptionalText } from '../../utils'

const normalizeRequiredText = (value: unknown, label: string): string => {
  const normalized = normalizeOptionalText(value)

  if (!normalized) {
    throw createError({ statusCode: 400, statusMessage: `${label} is required.` })
  }

  return normalized
}

const normalizeOptionalDate = (value: unknown): string | null => {
  if (value === null) {
    return null
  }

  const normalized = normalizeOptionalText(value)

  if (!normalized) {
    return null
  }

  const date = new Date(normalized)

  if (Number.isNaN(date.getTime())) {
    throw createError({ statusCode: 400, statusMessage: `Invalid date value: ${normalized}` })
  }

  return normalized
}

const normalizeRequiredDate = (value: unknown, label: string): string => {
  const normalized = normalizeOptionalDate(value)

  if (!normalized) {
    throw createError({ statusCode: 400, statusMessage: `${label} is required.` })
  }

  return normalized
}

const normalizeOptionalCoordinate = (
  value: unknown,
  label: string,
  minimum: number,
  maximum: number,
): number | null => {
  if (value === undefined || value === null || value === '') {
    return null
  }

  const numericValue = typeof value === 'number' ? value : Number(value)

  if (Number.isNaN(numericValue) || numericValue < minimum || numericValue > maximum) {
    throw createError({ statusCode: 400, statusMessage: `${label} must be between ${minimum} and ${maximum}.` })
  }

  return numericValue
}

const ensureDeploymentDateRange = (startDate: string, endDate: string | null) => {
  if (!endDate) {
    return
  }

  if (new Date(endDate).getTime() < new Date(startDate).getTime()) {
    throw createError({ statusCode: 400, statusMessage: 'End date must be on or after start date.' })
  }
}

export const parseCreateDeploymentRecordPayload = (body: CreateDeploymentRecordRequest) => {
  const rawBody = body as CreateDeploymentRecordRequest & {
    supervisor_id?: string | null
    supervisor_personnel_id?: string | null
  }
  const personnelId = normalizeRequiredText(body.personnelId, 'Personnel id')
  const deploymentArea = normalizeRequiredText(body.deploymentArea, 'Deployment area')
  const deploymentAreaLatitude = normalizeOptionalCoordinate(body.deploymentAreaLatitude, 'Deployment area latitude', -90, 90)
  const deploymentAreaLongitude = normalizeOptionalCoordinate(body.deploymentAreaLongitude, 'Deployment area longitude', -180, 180)
  const assignmentRole = body.assignmentRole === undefined ? null : normalizeOptionalText(body.assignmentRole)
  const operationName = body.operationName === undefined ? null : normalizeOptionalText(body.operationName)
  const startDate = normalizeRequiredDate(body.startDate, 'Start date')
  const endDate = normalizeOptionalDate(body.endDate)
  const statusId = normalizeRequiredText(body.statusId, 'Deployment status id')
  const location = body.location === undefined ? null : normalizeOptionalText(body.location)
  const supervisorSuggestionId = body.supervisorPersonnelId === undefined
    ? undefined
    : normalizeOptionalText(body.supervisorPersonnelId)
  const supervisorSuggestionSnakeId = rawBody.supervisor_personnel_id === undefined
    ? undefined
    : normalizeOptionalText(rawBody.supervisor_personnel_id)
  const supervisorSnakeId = rawBody.supervisor_id === undefined
    ? undefined
    : normalizeOptionalText(rawBody.supervisor_id)
  const supervisorId = supervisorSuggestionId === undefined
    ? (supervisorSuggestionSnakeId === undefined
        ? (body.supervisorId === undefined
            ? (supervisorSnakeId ?? null)
            : normalizeOptionalText(body.supervisorId))
        : supervisorSuggestionSnakeId)
    : supervisorSuggestionId
  const remarks = body.remarks === undefined ? null : normalizeOptionalText(body.remarks)

  ensureDeploymentDateRange(startDate, endDate)

  return {
    personnel_id: personnelId,
    deployment_area: deploymentArea,
    deployment_area_latitude: deploymentAreaLatitude,
    deployment_area_longitude: deploymentAreaLongitude,
    assignment_role: assignmentRole,
    operation_name: operationName,
    start_date: startDate,
    end_date: endDate,
    status_id: statusId,
    location,
    supervisor_id: supervisorId,
    remarks,
  }
}

export const parseCreateDeploymentPayload = (body: CreateDeploymentRequest) => {
  const rawBody = body as CreateDeploymentRequest & {
    supervisor_id?: string | null
    supervisor_personnel_id?: string | null
  }
  const deploymentArea = normalizeRequiredText(body.deploymentArea, 'Deployment area')
  const deploymentAreaLatitude = normalizeOptionalCoordinate(body.deploymentAreaLatitude, 'Deployment area latitude', -90, 90)
  const deploymentAreaLongitude = normalizeOptionalCoordinate(body.deploymentAreaLongitude, 'Deployment area longitude', -180, 180)
  const assignmentRole = body.assignmentRole === undefined ? null : normalizeOptionalText(body.assignmentRole)
  const operationName = body.operationName === undefined ? null : normalizeOptionalText(body.operationName)
  const startDate = normalizeRequiredDate(body.startDate, 'Start date')
  const endDate = normalizeOptionalDate(body.endDate)
  const statusId = normalizeRequiredText(body.statusId, 'Deployment status id')
  const location = body.location === undefined ? null : normalizeOptionalText(body.location)
  const supervisorSuggestionId = body.supervisorPersonnelId === undefined
    ? undefined
    : normalizeOptionalText(body.supervisorPersonnelId)
  const supervisorSuggestionSnakeId = rawBody.supervisor_personnel_id === undefined
    ? undefined
    : normalizeOptionalText(rawBody.supervisor_personnel_id)
  const supervisorSnakeId = rawBody.supervisor_id === undefined
    ? undefined
    : normalizeOptionalText(rawBody.supervisor_id)
  const supervisorId = supervisorSuggestionId === undefined
    ? (supervisorSuggestionSnakeId === undefined
        ? (body.supervisorId === undefined
            ? (supervisorSnakeId ?? null)
            : normalizeOptionalText(body.supervisorId))
        : supervisorSuggestionSnakeId)
    : supervisorSuggestionId
  const remarks = body.remarks === undefined ? null : normalizeOptionalText(body.remarks)

  ensureDeploymentDateRange(startDate, endDate)

  return {
    deployment_area: deploymentArea,
    deployment_area_latitude: deploymentAreaLatitude,
    deployment_area_longitude: deploymentAreaLongitude,
    assignment_role: assignmentRole,
    operation_name: operationName,
    start_date: startDate,
    end_date: endDate,
    status_id: statusId,
    location,
    supervisor_id: supervisorId,
    default_remarks: remarks,
  }
}

export const parseCreateDeploymentRecordFromDeploymentPayload = (
  body: CreateDeploymentRecordFromDeploymentRequest,
) => {
  const personnelId = normalizeRequiredText(body.personnelId, 'Personnel id')
  const deploymentId = normalizeRequiredText(body.deploymentId, 'Deployment id')
  const remarks = body.remarks === undefined ? null : normalizeOptionalText(body.remarks)

  return {
    personnel_id: personnelId,
    deployment_id: deploymentId,
    remarks,
  }
}

export const buildDeploymentUpdates = (body: UpdateDeploymentRequest) => {
  const rawBody = body as UpdateDeploymentRequest & {
    assignment_role?: string | null
    operation_name?: string | null
    start_date?: string
    end_date?: string | null
    status_id?: string
    supervisor_id?: string | null
    supervisor_personnel_id?: string | null
    default_remarks?: string | null
  }

  const updates: {
    assignment_role?: string | null
    operation_name?: string | null
    start_date?: string
    end_date?: string | null
    status_id?: string
    supervisor_id?: string | null
    default_remarks?: string | null
  } = {}

  if (body.assignmentRole !== undefined || rawBody.assignment_role !== undefined) {
    updates.assignment_role = normalizeOptionalText(body.assignmentRole ?? rawBody.assignment_role)
  }
  if (body.operationName !== undefined || rawBody.operation_name !== undefined) {
    updates.operation_name = normalizeOptionalText(body.operationName ?? rawBody.operation_name)
  }
  if (body.startDate !== undefined || rawBody.start_date !== undefined) {
    updates.start_date = normalizeRequiredDate(body.startDate ?? rawBody.start_date, 'Start date')
  }
  if (body.endDate !== undefined || rawBody.end_date !== undefined) {
    updates.end_date = normalizeOptionalDate(body.endDate ?? rawBody.end_date)
  }
  if (body.statusId !== undefined || rawBody.status_id !== undefined) {
    updates.status_id = normalizeRequiredText(body.statusId ?? rawBody.status_id, 'Deployment status id')
  }

  const supervisorSuggestionId = body.supervisorPersonnelId ?? rawBody.supervisor_personnel_id
  const directSupervisorId = body.supervisorId ?? rawBody.supervisor_id
  if (body.supervisorId !== undefined || body.supervisorPersonnelId !== undefined || rawBody.supervisor_id !== undefined || rawBody.supervisor_personnel_id !== undefined) {
    updates.supervisor_id = normalizeOptionalText(supervisorSuggestionId === undefined ? directSupervisorId : supervisorSuggestionId)
  }

  if (body.remarks !== undefined || rawBody.default_remarks !== undefined) {
    updates.default_remarks = normalizeOptionalText(body.remarks ?? rawBody.default_remarks)
  }

  return updates
}

export const buildDeploymentRecordUpdates = (body: UpdateDeploymentRecordRequest) => {
  const updates: {
    personnel_id?: string
    deployment_area?: string
    deployment_area_latitude?: number | null
    deployment_area_longitude?: number | null
    assignment_role?: string | null
    operation_name?: string | null
    start_date?: string
    end_date?: string | null
    status_id?: string
    location?: string | null
    supervisor_id?: string | null
    remarks?: string | null
  } = {}

  if (body.personnelId !== undefined) {
    updates.personnel_id = normalizeRequiredText(body.personnelId, 'Personnel id')
  }

  if (body.deploymentArea !== undefined) {
    updates.deployment_area = normalizeRequiredText(body.deploymentArea, 'Deployment area')
  }

  if (body.deploymentAreaLatitude !== undefined) {
    updates.deployment_area_latitude = normalizeOptionalCoordinate(body.deploymentAreaLatitude, 'Deployment area latitude', -90, 90)
  }

  if (body.deploymentAreaLongitude !== undefined) {
    updates.deployment_area_longitude = normalizeOptionalCoordinate(body.deploymentAreaLongitude, 'Deployment area longitude', -180, 180)
  }

  if (body.assignmentRole !== undefined) {
    updates.assignment_role = normalizeOptionalText(body.assignmentRole)
  }

  if (body.operationName !== undefined) {
    updates.operation_name = normalizeOptionalText(body.operationName)
  }

  if (body.startDate !== undefined) {
    updates.start_date = normalizeRequiredDate(body.startDate, 'Start date')
  }

  if (body.endDate !== undefined) {
    updates.end_date = normalizeOptionalDate(body.endDate)
  }

  if (body.statusId !== undefined) {
    updates.status_id = normalizeRequiredText(body.statusId, 'Deployment status id')
  }

  if (body.location !== undefined) {
    updates.location = normalizeOptionalText(body.location)
  }

  if (body.supervisorId !== undefined) {
    updates.supervisor_id = normalizeOptionalText(body.supervisorId)
  }

  if (body.remarks !== undefined) {
    updates.remarks = normalizeOptionalText(body.remarks)
  }

  return updates
}

export const validateDeploymentDateRange = (startDate: string, endDate: string | null) => {
  ensureDeploymentDateRange(startDate, endDate)
}
