import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import type { CreateEngagementRecordPayload } from '~/types/domain/engagement'
import type { PersonnelLocationItem } from '~/types/domain/personnel'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'

export type ActiveServiceStatusModal = 'deployment' | 'engagement' | 'training' | 'equipment' | null

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
  assignDeployment: (personnelId: string, payload: Omit<CreateDeploymentRecordPayload, 'personnel_id'>) => Promise<void>
  assignEngagement: (personnelId: string, payload: Omit<CreateEngagementRecordPayload, 'personnel_id'>) => Promise<void>
  assignTraining: (personnelId: string, payload: Omit<CreateTrainingRecordPayload, 'personnelId'>) => Promise<void>
  reload: () => Promise<void>
}
