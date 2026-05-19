import { defineStore } from 'pinia'
import { extractApiErrorMessage } from '~/utils/api-request'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import type { CreateEngagementRecordPayload } from '~/types/domain/engagement'
import type { CreateTrainingRecordPayload } from '~/types/domain/training'
import {
  assignPersonnelDeploymentRecordEndpoint,
  assignPersonnelEngagementRecordEndpoint,
  assignPersonnelTrainingRecordEndpoint,
} from '~/utils/service-status-endpoints'
import type { AssignmentsStoreState } from '~/types/domain/service-status'

export const useAssignmentsStore = defineStore('assignments', {
  state: (): AssignmentsStoreState => ({
    isSubmitting: false,
    error: '',
  }),
  getters: {
    hasError: (state) => state.error.length > 0,
  },
  actions: {
    clearError() {
      this.error = ''
    },
  },
})
