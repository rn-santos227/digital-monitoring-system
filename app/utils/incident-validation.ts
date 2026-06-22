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
  ])
}
