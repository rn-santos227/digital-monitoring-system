import type { CreateDeploymentPayload } from '~/types/domain/deployment'

export const validateCreateDeploymentForm = (form: {
  deploymentArea: string
  assignmentRole: string
  deploymentAreaLatitude: string
  deploymentAreaLongitude: string
  operationName: string
  startDate: string
  endDate: string
  statusId: string
  location: string
  supervisorId: string
  defaultRemarks: string
}): { errors: Record<string, string>; payload: CreateDeploymentPayload | null } => {
  const errors: Record<string, string> = {}

  if (!form.deploymentArea.trim()) {
    errors.deploymentArea = 'Deployment area is required.'
  }

  if (!form.startDate.trim()) {
    errors.startDate = 'Start date is required.'
  }

  if (!form.statusId.trim()) {
    errors.statusId = 'Deployment status ID is required.'
  }

  const normalizedLatitude = form.deploymentAreaLatitude.trim()
  const normalizedLongitude = form.deploymentAreaLongitude.trim()

  const parsedLatitude = normalizedLatitude ? Number.parseFloat(normalizedLatitude) : Number.NaN
  const parsedLongitude = normalizedLongitude ? Number.parseFloat(normalizedLongitude) : Number.NaN

  const latitudeValue = normalizedLatitude && Number.isFinite(parsedLatitude) ? parsedLatitude : null
  const longitudeValue = normalizedLongitude && Number.isFinite(parsedLongitude) ? parsedLongitude : null

  if (normalizedLatitude && (latitudeValue === null || latitudeValue < -90 || latitudeValue > 90)) {
    errors.deploymentAreaLatitude = 'Latitude must be a valid number between -90 and 90.'
  }

  if (normalizedLongitude && (longitudeValue === null || longitudeValue < -180 || longitudeValue > 180)) {
    errors.deploymentAreaLongitude = 'Longitude must be a valid number between -180 and 180.'
  }

  if (form.endDate && form.startDate && form.endDate < form.startDate) {
    errors.endDate = 'End date cannot be earlier than start date.'
  }

  if (Object.keys(errors).length > 0) {
    return { errors, payload: null }
  }

  return {
    errors: {},
    payload: {
      deploymentArea: form.deploymentArea.trim(),
      deploymentAreaLatitude: latitudeValue,
      deploymentAreaLongitude: longitudeValue,
      assignmentRole: form.assignmentRole.trim() || null,
      operationName: form.operationName.trim() || null,
      startDate: form.startDate.trim(),
      endDate: form.endDate.trim() || null,
      statusId: form.statusId.trim(),
      location: form.location.trim() || null,
      supervisorId: form.supervisorId.trim() || null,
      remarks: form.defaultRemarks.trim() || null,
    },
  }
}
