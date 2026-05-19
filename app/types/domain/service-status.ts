import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import type { CreateEngagementRecordPayload } from '~/types/domain/engagement'
import type { PersonnelLocationItem } from '~/types/domain/personnel'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'

export type ActiveServiceStatusModal = 'deployment' | 'engagement' | 'training' | null

export interface PersonnelLocationsResponse {
  items: PersonnelLocationItem[]
}

export interface AssignmentsStoreState {
  isSubmitting: boolean
  error: string
}

export interface ServiceStatusAssignmentHandlerOptions {
  selectedPersonnelId: Ref<string | null>
  activeModal: Ref<ActiveServiceStatusModal>
  modalErrorMessage: Ref<string>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
  assignDeployment: (personnelId: string, payload: CreateDeploymentRecordPayload) => Promise<void>
  assignEngagement: (personnelId: string, payload: CreateEngagementRecordPayload) => Promise<void>
  assignTraining: (personnelId: string, payload: CreateTrainingRecordPayload) => Promise<void>
  reload: () => Promise<void>
}
