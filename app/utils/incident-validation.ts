import type { CreateEquipmentIncidentPayload } from '~/types/domain/incident'
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
}
