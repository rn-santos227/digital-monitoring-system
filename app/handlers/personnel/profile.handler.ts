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
  reloadProfile: (personnelId: string) => Promise<unknown>
  showDialog: (dialog: DialogInput) => Promise<{ confirmed: boolean }>
}

export const usePersonnelProfileHandlers = ({
  personnelId,
  activeTab,
  activeAssignModal,
  assignDeployment,
  assignEngagement,
  assignTraining,
  reloadProfile,
  showDialog,
}: UsePersonnelProfileHandlersOptions) => {
  const onCloseAssignModal = () => {
    activeAssignModal.value = null
  }

  const onSubmitAssignDeployment = async (
    payload: Omit<CreateDeploymentRecordPayload, 'personnel_id'>,
  ) => {
    const id = personnelId.value

    if (!id) {
      return
    }

    try {
      await assignDeployment(id, { ...payload, personnel_id: id })
      onCloseAssignModal()
      await reloadProfile(id)
    } catch(error) {
      await showErrorDialog({
        showDialog,
        title: 'Deployment assignment failed',
        error,
        fallbackMessage: 'Unable to assign deployment record right now.',
      })
    }
  }

  const onSubmitAssignEngagement = async (
    payload: Omit<CreateEngagementRecordPayload, 'personnel_id'>,
  ) => {
    const id = personnelId.value

    if (!id) {
      return
    }

    try {
      await assignEngagement(id, { ...payload, personnel_id: id })
      onCloseAssignModal()
      await reloadProfile(id)
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Engagement assignment failed',
        error,
        fallbackMessage: 'Unable to assign engagement record right now.',
      })
    }
  }

  const onSubmitAssignTraining = async (
    payload: Omit<CreateTrainingRecordPayload, 'personnelId'>,
  ) => {
    const id = personnelId.value

    if (!id) {
      return
    }

    try {
      await assignTraining(id, { ...payload, personnelId: id })
      onCloseAssignModal()
      await reloadProfile(id)
    } catch (error) {
      await showErrorDialog({
        showDialog,
        title: 'Training assignment failed',
        error,
        fallbackMessage: 'Unable to assign training record right now.',
      })
    }
  }

  const onTabChange = (nextTab: string) => {
    if (
      nextTab === 'training'
      || nextTab === 'deployment'
      || nextTab === 'engagement'
      || nextTab === 'equipment-assignment'
    ) {
      activeTab.value = nextTab
    }
  }
}
