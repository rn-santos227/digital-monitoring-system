import type { PersonnelLocationItem } from '~/types/domain/personnel'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import type { CreateEngagementRecordPayload } from '~/types/domain/engagement'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'
import { showErrorDialog } from '~/utils/error-handling'

import type { ServiceStatusAssignmentHandlerOptions } from '~/types/domain/service-status'

export const useServiceStatusAssignmentHandler = (options: ServiceStatusAssignmentHandlerOptions) => {
  const onOpenAssignDeployment = (item: PersonnelLocationItem) => {
    options.selectedPersonnelId.value = item.personnelId
    options.modalErrorMessage.value = ''
    options.activeModal.value = 'deployment'
  }

  const onOpenAssignEngagement = (item: PersonnelLocationItem) => {
    options.selectedPersonnelId.value = item.personnelId
    options.modalErrorMessage.value = ''
    options.activeModal.value = 'engagement'
  }

  const onOpenAssignTraining = (item: PersonnelLocationItem) => {
    options.selectedPersonnelId.value = item.personnelId
    options.modalErrorMessage.value = ''
    options.activeModal.value = 'training'
  }

  const onCloseModal = () => {
    options.activeModal.value = null
    options.modalErrorMessage.value = ''
  }

  const onSubmitAssignDeployment = async (payload: CreateDeploymentRecordPayload) => {
    if (!options.selectedPersonnelId.value) {
      return
    }

    try {
      await options.assignDeployment(options.selectedPersonnelId.value, payload)
      onCloseModal()
      await options.reload()
    } catch (error) {
      options.modalErrorMessage.value = await showErrorDialog({
        showDialog: options.showDialog,
        title: 'Deployment assignment failed',
        error,
        fallbackMessage: 'Unable to assign deployment record right now.',
      })
    }
  }

  const onSubmitAssignEngagement = async (payload: CreateEngagementRecordPayload) => {
    if (!options.selectedPersonnelId.value) {
      return
    }

    try {
      await options.assignEngagement(options.selectedPersonnelId.value, payload)
      onCloseModal()
      await options.reload()
    } catch (error) {
      options.modalErrorMessage.value = await showErrorDialog({
        showDialog: options.showDialog,
        title: 'Engagement assignment failed',
        error,
        fallbackMessage: 'Unable to assign engagement record right now.',
      })
    }
  }

  const onSubmitAssignTraining = async (payload: CreateTrainingRecordPayload) => {
    if (!options.selectedPersonnelId.value) {
      return
    }

    try {
      await options.assignTraining(options.selectedPersonnelId.value, payload)
      onCloseModal()
      await options.reload()
    } catch (error) {
      options.modalErrorMessage.value = await showErrorDialog({
        showDialog: options.showDialog,
        title: 'Training assignment failed',
        error,
        fallbackMessage: 'Unable to assign training record right now.',
      })
    }
  }

  return {
    onOpenAssignDeployment,
    onOpenAssignEngagement,
    onOpenAssignTraining,
    onCloseModal,
    onSubmitAssignDeployment,
    onSubmitAssignEngagement,
    onSubmitAssignTraining,
  }
}
