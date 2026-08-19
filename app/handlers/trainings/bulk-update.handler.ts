import type { Ref } from 'vue'
import type { DialogInput, DialogResult } from '~/composables/useDialog'
import type { TrainingBulkUpdateValuesByDomain, TrainingBulkUpdateDomain } from '~/types/domain/training'
import { extractApiErrorMessage } from '~/utils/api-request'
import { updateBulkRecordsEndpoint } from '~/utils/bulk-management-endpoints'

interface BulkUpdateTrainingsHandlerOptions<TDomain extends TrainingBulkUpdateDomain> {
  domain: TDomain
  selectedIds: Ref<string[]>
  isModalOpen: Ref<boolean>
  errorMessage: Ref<string>
  reload: () => Promise<void>
  showDialog: (input: DialogInput) => Promise<DialogResult>
}

export const useBulkUpdateTrainingsHandler = <TDomain extends TrainingBulkUpdateDomain>({
  domain,
  selectedIds,
  isModalOpen,
  errorMessage,
  reload,
  showDialog,
}: BulkUpdateTrainingsHandlerOptions<TDomain>) => {
  const labels: Record<TrainingBulkUpdateDomain, string> = {
    trainings: 'training',
    'training-records': 'training record',
  }
  const label = labels[domain]

  const openBulkUpdateModal = () => {
    errorMessage.value = ''
    isModalOpen.value = true
  }

  const closeBulkUpdateModal = () => {
    errorMessage.value = ''
    isModalOpen.value = false
  }

  const updateSelectedTrainings = async (updates: TrainingBulkUpdateValuesByDomain[TDomain]) => {
    const ids = [...new Set(selectedIds.value)].filter(Boolean)
    if (ids.length === 0) {
      closeBulkUpdateModal()
      return
    }

    errorMessage.value = ''
    try {
    } catch (error: unknown) {
      errorMessage.value = extractApiErrorMessage(
        error,
        `No ${label}s were updated. Review the selected values and try again.`,
      )
      await showDialog({
        type: 'error',
        title: 'Bulk update failed',
        message: errorMessage.value,
        confirmLabel: 'OK',
      })
    }
  }

  return {
    openBulkUpdateModal,
    closeBulkUpdateModal,
    updateSelectedTrainings,
  }
}
