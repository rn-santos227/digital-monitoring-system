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
}) => {

}
