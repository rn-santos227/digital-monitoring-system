import type {
  CreateEquipmentIncidentPayload,
  UpdateEquipmentIncidentDeploymentPayload,
  UpdateEquipmentIncidentDetailsPayload,
  UpdateEquipmentIncidentEquipmentPayload,
  UpdateEquipmentIncidentPersonnelPayload,
  UpdateEquipmentIncidentLocationPayload,
  UpdateEquipmentIncidentStatusPayload,
} from '~/types/domain/incident'
import { validateFields } from '~/utils/field-validation'

export const validateCreateEquipmentIncidentForm = (form: {
  incidentNo: string
  equipmentAssetId: string
  personnelId: string
  deploymentId: string
  incidentTypeId: string
  incidentDate: string
  location: string
  locationLatitude: number | null
  locationLongitude: number | null
  description: string
  investigationStatusId: string
  resolution: string
  remarks: string
}) => {
  const result = validateFields([
    { field: 'incidentNo', label: 'Incident number', value: form.incidentNo, required: true, maxLength: 80 },
    { field: 'equipmentAssetId', label: 'Equipment asset', value: form.equipmentAssetId, required: true },
    { field: 'incidentTypeId', label: 'Incident type', value: form.incidentTypeId, required: true },
    { field: 'incidentDate', label: 'Incident date', value: form.incidentDate, required: true },
    { field: 'description', label: 'Description', value: form.description, required: true, maxLength: 2000 },
  ])

  const errors = { ...result.errors }

  if (form.locationLatitude !== null && (!Number.isFinite(form.locationLatitude) || form.locationLatitude < -90 || form.locationLatitude > 90)) {
    errors.locationLatitude = 'Location latitude must be between -90 and 90.'
  }

  if (form.locationLongitude !== null && (!Number.isFinite(form.locationLongitude) || form.locationLongitude < -180 || form.locationLongitude > 180)) {
    errors.locationLongitude = 'Location longitude must be between -180 and 180.'
  }

  const payload: CreateEquipmentIncidentPayload | null = Object.keys(errors).length === 0
    ? {
      incidentNo: result.values.incidentNo ?? '',
      equipmentAssetId: result.values.equipmentAssetId ?? '',
      personnelId: form.personnelId || null,
      deploymentId: form.deploymentId || null,
      incidentTypeId: result.values.incidentTypeId ?? '',
      incidentDate: result.values.incidentDate ?? '',
      location: form.location || null,
      locationLatitude: form.locationLatitude,
      locationLongitude: form.locationLongitude,
      description: result.values.description ?? '',
      investigationStatusId: form.investigationStatusId || null,
      resolution: form.resolution || null,
      remarks: form.remarks || null,
    }
    : null

  return {
    errors,
    payload,
  }
}


export const validateUpdateEquipmentIncidentDetailsForm = (form: {
  incidentNo: string
  incidentTypeId: string
  incidentDate: string
  description: string
  resolution: string
  remarks: string
}) => {
  const result = validateFields([
    { field: 'incidentNo', label: 'Incident number', value: form.incidentNo, required: true, maxLength: 80 },
    { field: 'incidentTypeId', label: 'Incident type', value: form.incidentTypeId, required: true },
    { field: 'incidentDate', label: 'Incident date', value: form.incidentDate, required: true },
    { field: 'description', label: 'Description', value: form.description, required: true, maxLength: 2000 },
  ])

  const payload: UpdateEquipmentIncidentDetailsPayload | null = Object.keys(result.errors).length === 0
    ? {
      incidentNo: result.values.incidentNo ?? '',
      incidentTypeId: result.values.incidentTypeId ?? '',
      incidentDate: result.values.incidentDate ?? '',
      description: result.values.description ?? '',
      resolution: form.resolution || null,
      remarks: form.remarks || null,
    }
    : null

  return { errors: result.errors, payload }
}

export const validateUpdateEquipmentIncidentEquipmentForm = (form: {
  equipmentAssetId: string
}) => {
  const result = validateFields([
    { field: 'equipmentAssetId', label: 'Equipment asset', value: form.equipmentAssetId, required: true },
  ])
  const payload: UpdateEquipmentIncidentEquipmentPayload | null = Object.keys(result.errors).length === 0
    ? { equipmentAssetId: result.values.equipmentAssetId ?? '' }
    : null

  return { errors: result.errors, payload }
}

export const validateUpdateEquipmentIncidentPersonnelForm = (form: {
  personnelId: string
}) => {
  const payload: UpdateEquipmentIncidentPersonnelPayload = {
    personnelId: form.personnelId || null,
  }

  return { errors: {}, payload }
}

export const validateUpdateEquipmentIncidentDeploymentForm = (form: {
  deploymentId: string
}) => {
  const payload: UpdateEquipmentIncidentDeploymentPayload = {
    deploymentId: form.deploymentId || null,
  }

  return { errors: {}, payload }
}


export const validateUpdateEquipmentIncidentLocationForm = (form: {
  location: string
  locationLatitude: number | null
  locationLongitude: number | null
}) => {
  const errors: Record<string, string> = {}

  if (form.locationLatitude !== null && (!Number.isFinite(form.locationLatitude) || form.locationLatitude < -90 || form.locationLatitude > 90)) {
    errors.locationLatitude = 'Location latitude must be between -90 and 90.'
  }

  if (form.locationLongitude !== null && (!Number.isFinite(form.locationLongitude) || form.locationLongitude < -180 || form.locationLongitude > 180)) {
    errors.locationLongitude = 'Location longitude must be between -180 and 180.'
  }

  const payload: UpdateEquipmentIncidentLocationPayload | null = Object.keys(errors).length === 0
    ? {
      location: form.location || null,
      locationLatitude: form.locationLatitude,
      locationLongitude: form.locationLongitude,
    }
    : null

  return { errors, payload }
}

export const validateUpdateEquipmentIncidentStatusForm = (form: {
  investigationStatusId: string
}) => {
  const payload: UpdateEquipmentIncidentStatusPayload = {
    investigationStatusId: form.investigationStatusId || null,
  }

  return { errors: {}, payload }
}
