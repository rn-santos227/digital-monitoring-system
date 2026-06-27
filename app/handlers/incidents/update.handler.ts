import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type {
  EquipmentIncidentTableRow,
  UpdateEquipmentIncidentDeploymentPayload,
  UpdateEquipmentIncidentDetailsPayload,
  UpdateEquipmentIncidentEquipmentPayload,
  UpdateEquipmentIncidentPersonnelPayload,
  UpdateEquipmentIncidentLocationPayload,
  UpdateEquipmentIncidentStatusPayload,
} from '~/types/domain/incident'
import { extractApiErrorMessage } from '~/utils/api-request'

export type IncidentUpdateSection = 'deployment' | 'details' | 'equipment' | 'personnel' | 'location' | 'status'

interface IncidentUpdateHandlerOptions {
  selectedIncident: Ref<EquipmentIncidentTableRow | null>
  activeUpdateSection: Ref<IncidentUpdateSection | null>
  updateError: Ref<string>
  showDialog: (input: DialogInput) => Promise<DialogResult>
  updateDeployment: (id: string, payload: UpdateEquipmentIncidentDeploymentPayload) => Promise<void>
  updateDetails: (id: string, payload: UpdateEquipmentIncidentDetailsPayload) => Promise<void>
  updateEquipment: (id: string, payload: UpdateEquipmentIncidentEquipmentPayload) => Promise<void>
  updatePersonnel: (id: string, payload: UpdateEquipmentIncidentPersonnelPayload) => Promise<void>
  updateLocation: (id: string, payload: UpdateEquipmentIncidentLocationPayload) => Promise<void>
  updateStatus: (id: string, payload: UpdateEquipmentIncidentStatusPayload) => Promise<void>
}
