import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAssignmentsStore } from '~/stores/assignments'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import type { CreateEngagementRecordPayload } from '~/types/domain/engagement'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'

export const useAssignments = () => {
  const assignmentsStore = useAssignmentsStore()
  const { isSubmitting, error } = storeToRefs(assignmentsStore)

  const assignDeployment = async (personnelId: string, payload: CreateDeploymentRecordPayload) => {
    await assignmentsStore.assignDeployment(personnelId, payload)
  }

  const assignEngagement = async (personnelId: string, payload: CreateEngagementRecordPayload) => {
    await assignmentsStore.assignEngagement(personnelId, payload)
  }

  const assignTraining = async (personnelId: string, payload: CreateTrainingRecordPayload) => {
    await assignmentsStore.assignTraining(personnelId, payload)
  }

  return {
    isSubmitting: computed(() => isSubmitting.value),
    error: computed(() => error.value),
    assignDeployment,
    assignEngagement,
    assignTraining,
    clearError: assignmentsStore.clearError,
  }
}
