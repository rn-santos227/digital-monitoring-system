import type { Ref } from 'vue'
import type { TrainingListItem, TrainingRecordListItem } from '~/types/domain/training'

interface UseViewTrainingHandlerOptions {
  isViewTrainingModalOpen: Ref<boolean>
  isTrainingPersonnelLoading: Ref<boolean>
  selectedTraining: Ref<TrainingListItem | null>
  trainingPersonnelRows: Ref<Record<string, string>[]>
  getTrainingById: (id: string) => Promise<TrainingListItem>
  getTrainingPersonnel: (trainingId: string, pageSize?: number) => Promise<{ items: TrainingRecordListItem[] }>
}

export const useViewTrainingHandler = ({
  isViewTrainingModalOpen,
  isTrainingPersonnelLoading,
  selectedTraining,
  trainingPersonnelRows,
  getTrainingById,
  getTrainingPersonnel,
}: UseViewTrainingHandlerOptions) => {
  const closeViewTrainingModal = () => {
    isViewTrainingModalOpen.value = false
    selectedTraining.value = null
    trainingPersonnelRows.value = []
  }

  const onViewTraining = async (trainingId: string) => {
    selectedTraining.value = await getTrainingById(trainingId)
    isViewTrainingModalOpen.value = true
    isTrainingPersonnelLoading.value = true

    try {
      const response = await getTrainingPersonnel(trainingId, 100)
      trainingPersonnelRows.value = response.items.map(item => ({
        personnelId: item.personnelId,
        personnelCode: item.personnelCode ?? '—',
        personnelName: item.personnelName ?? '—',
        recordNo: item.recordNo,
        certificateNo: item.certificateNo ?? '—',
        remarks: item.remarks ?? '—',
      }))
    } finally {
      isTrainingPersonnelLoading.value = false
    }
  }

  return {
    closeViewTrainingModal,
    onViewTraining,
  }
}
