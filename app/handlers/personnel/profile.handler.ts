import type { Ref } from 'vue'
import type { DialogInput } from '~/composables/useDialog'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import type { CreateEngagementRecordPayload } from '~/types/domain/engagement'
import type { PersonnelProfileTabId } from '~/types/domain/personnel'
import type { ActiveServiceStatusModal } from '~/types/domain/service-status'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'
import { showErrorDialog } from '~/utils/error-handling'

interface UsePersonnelProfileHandlersOptions {
  personnelId: Ref<string>
  activeTab: Ref<PersonnelProfileTabId>
  activeAssignModal: Ref<ActiveServiceStatusModal>
  assignDeployment: (
    personnelId: string,
    payload: CreateDeploymentRecordPayload,
  ) => Promise<unknown>
  assignEngagement: (
    personnelId: string,
    payload: CreateEngagementRecordPayload,
  ) => Promise<unknown>
  assignTraining: (
    personnelId: string,
    payload: CreateTrainingRecordPayload,
  ) => Promise<unknown>
}
