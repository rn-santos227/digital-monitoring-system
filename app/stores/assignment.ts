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
    async assignDeployment(personnelId: string, payload: CreateDeploymentRecordPayload) {
      this.isSubmitting = true
      this.error = ''
      try {
        await assignPersonnelDeploymentRecordEndpoint(personnelId, payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to assign deployment record.')
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    async assignEngagement(personnelId: string, payload: CreateEngagementRecordPayload) {
      this.isSubmitting = true
      this.error = ''
      try {
        await assignPersonnelEngagementRecordEndpoint(personnelId, payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to assign engagement record.')
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    async assignTraining(personnelId: string, payload: CreateTrainingRecordPayload) {
      this.isSubmitting = true
      this.error = ''
      try {
        await assignPersonnelTrainingRecordEndpoint(personnelId, payload)
      } catch (error) {
        this.error = extractApiErrorMessage(error, 'Unable to assign training record.')
        throw error
      } finally {
        this.isSubmitting = false
      }
    },

    clearError() {
      this.error = ''
    },
  },
})
