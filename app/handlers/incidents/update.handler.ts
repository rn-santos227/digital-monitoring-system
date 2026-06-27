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

export const useUpdateEquipmentIncidentHandler = (options: IncidentUpdateHandlerOptions) => {
  const openUpdateModal = (section: IncidentUpdateSection, row: EquipmentIncidentTableRow) => {
    options.updateError.value = ''
    options.selectedIncident.value = row
    options.activeUpdateSection.value = section
  }

  const closeUpdateModal = () => {
    options.updateError.value = ''
    options.activeUpdateSection.value = null
    options.selectedIncident.value = null
  }

  const submitUpdate = async <TPayload>(
    updateRequest: (id: string, payload: TPayload) => Promise<void>,
    payload: TPayload,
    successMessage: string,
  ) => {
    const incident = options.selectedIncident.value

    if (!incident) {
      return
    }

    try {
      await updateRequest(incident.id, payload)
      await options.showDialog({ type: 'success', title: 'Incident updated', message: successMessage })
      closeUpdateModal()
    } catch (error) {
      options.updateError.value = extractApiErrorMessage(error, 'Unable to update equipment incident.')
      await options.showDialog({ type: 'error', title: 'Update failed', message: options.updateError.value })
    }
  }

  return {
    openUpdateModal,
    closeUpdateModal,
    submitDeploymentUpdate: (payload: UpdateEquipmentIncidentDeploymentPayload) => submitUpdate(options.updateDeployment, payload, 'Incident deployment has been updated.'),
    submitDetailsUpdate: (payload: UpdateEquipmentIncidentDetailsPayload) => submitUpdate(options.updateDetails, payload, 'Incident details have been updated.'),
    submitEquipmentUpdate: (payload: UpdateEquipmentIncidentEquipmentPayload) => submitUpdate(options.updateEquipment, payload, 'Incident equipment has been updated.'),
    submitPersonnelUpdate: (payload: UpdateEquipmentIncidentPersonnelPayload) => submitUpdate(options.updatePersonnel, payload, 'Incident personnel has been updated.'),
    submitLocationUpdate: (payload: UpdateEquipmentIncidentLocationPayload) => submitUpdate(options.updateLocation, payload, 'Incident location has been updated.'),
    submitStatusUpdate: (payload: UpdateEquipmentIncidentStatusPayload) => submitUpdate(options.updateStatus, payload, 'Incident status has been updated.'),
  }
}
