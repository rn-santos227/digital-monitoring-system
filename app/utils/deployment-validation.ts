import type {
  CreateDeploymentPayload,
  CreateDeploymentRecordPayload,
  UpdateDeploymentRecordPayload,
} from '~/types/domain/deployment'

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

export const validateCreateDeploymentRecordForm = (form: {
  personnel_id: string
  deployment_id: string
  assignment_role: string
  deployment_area: string
  deployment_area_latitude: string
  deployment_area_longitude: string
  start_date: string
  end_date: string
  remarks: string
}): { errors: Record<string, string>; payload: CreateDeploymentRecordPayload | null } => {
  const errors: Record<string, string> = {}

  if (!form.personnel_id.trim()) {
    errors.personnel_id = 'Personnel is required.'
  }
  if (!form.deployment_id.trim()) {
    errors.deployment_id = 'Deployment is required.'
  }
  if (!form.deployment_area.trim()) {
    errors.deployment_area = 'Deployment area is required.'
  }
  if (!form.start_date.trim()) {
    errors.start_date = 'Start date is required.'
  }
  if (form.end_date && form.start_date && form.end_date < form.start_date) {
    errors.end_date = 'End date cannot be earlier than start date.'
  }
  const normalizedLatitude = form.deployment_area_latitude.trim()
  const normalizedLongitude = form.deployment_area_longitude.trim()
  const parsedLatitude = normalizedLatitude ? Number.parseFloat(normalizedLatitude) : Number.NaN
  const parsedLongitude = normalizedLongitude ? Number.parseFloat(normalizedLongitude) : Number.NaN
  const latitudeValue = normalizedLatitude && Number.isFinite(parsedLatitude) ? parsedLatitude : null
  const longitudeValue = normalizedLongitude && Number.isFinite(parsedLongitude) ? parsedLongitude : null

  if (normalizedLatitude && (latitudeValue === null || latitudeValue < -90 || latitudeValue > 90)) {
    errors.deployment_area_latitude = 'Latitude must be a valid number between -90 and 90.'
  }
  if (normalizedLongitude && (longitudeValue === null || longitudeValue < -180 || longitudeValue > 180)) {
    errors.deployment_area_longitude = 'Longitude must be a valid number between -180 and 180.'
  }

  if (Object.keys(errors).length > 0) {
    return { errors, payload: null }
  }

  return {
    errors: {},
    payload: {
      personnel_id: form.personnel_id.trim(),
      deployment_id: form.deployment_id.trim(),
      assignment_role: form.assignment_role.trim() || null,
      deployment_area: form.deployment_area.trim(),
      deployment_area_latitude: latitudeValue,
      deployment_area_longitude: longitudeValue,
      start_date: form.start_date.trim(),
      end_date: form.end_date.trim() || null,
      remarks: form.remarks.trim() || null,
    },
  }
}

export const validateUpdateDeploymentRecordForm = (form: {
  deployment_area: string
  deployment_area_latitude: string
  deployment_area_longitude: string
  start_date: string
  end_date: string
  assignment_role: string
  location: string
  remarks: string
}): { errors: Record<string, string>; payload: UpdateDeploymentRecordPayload | null } => {
  const errors: Record<string, string> = {}
  const normalizedLatitude = form.deployment_area_latitude.trim()
  const normalizedLongitude = form.deployment_area_longitude.trim()
  const parsedLatitude = normalizedLatitude ? Number.parseFloat(normalizedLatitude) : Number.NaN
  const parsedLongitude = normalizedLongitude ? Number.parseFloat(normalizedLongitude) : Number.NaN
  const latitudeValue = normalizedLatitude && Number.isFinite(parsedLatitude) ? parsedLatitude : null
  const longitudeValue = normalizedLongitude && Number.isFinite(parsedLongitude) ? parsedLongitude : null

  if (!form.deployment_area.trim()) {
    errors.deployment_area = 'Deployment area is required.'
  }
  if (!form.start_date.trim()) {
    errors.start_date = 'Start date is required.'
  }
  if (form.end_date && form.start_date && form.end_date < form.start_date) {
    errors.end_date = 'End date cannot be earlier than start date.'
  }
  if (normalizedLatitude && (latitudeValue === null || latitudeValue < -90 || latitudeValue > 90)) {
    errors.deployment_area_latitude = 'Latitude must be a valid number between -90 and 90.'
  }
  if (normalizedLongitude && (longitudeValue === null || longitudeValue < -180 || longitudeValue > 180)) {
    errors.deployment_area_longitude = 'Longitude must be a valid number between -180 and 180.'
  }

  if (Object.keys(errors).length > 0) {
    return { errors, payload: null }
  }

  return {
    errors: {},
    payload: {
      deployment_area: form.deployment_area.trim(),
      deployment_area_latitude: latitudeValue,
      deployment_area_longitude: longitudeValue,
      start_date: form.start_date.trim(),
      end_date: form.end_date.trim() || null,
      assignment_role: form.assignment_role.trim() || null,
      location: form.location.trim() || null,
      remarks: form.remarks.trim() || null,
    },
  }
}
