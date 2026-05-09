import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  TrainingCategoryListItem,
  TrainingRecordListItem,
  TrainingListItem,
  UpdateTrainingCategoryPayload,
  UpdateTrainingPayload,
  UpdateTrainingRecordPayload,
} from '~/types/domain/training'

interface UseUpdateTrainingHandlerOptions {
  isUpdateTrainingModalOpen: Ref<boolean>
  selectedTraining: Ref<TrainingListItem | null>
  getTrainingById: (id: string) => Promise<TrainingListItem>
  updateTraining: (id: string, payload: UpdateTrainingPayload) => Promise<void>
}

interface UseUpdateTrainingCategoryHandlerOptions {
  isUpdateTrainingCategoryModalOpen: Ref<boolean>
  selectedTrainingCategory: Ref<TrainingCategoryListItem | null>
  getTrainingCategoryById: (id: string) => Promise<TrainingCategoryListItem>
  updateTrainingCategory: (id: string, payload: UpdateTrainingCategoryPayload) => Promise<void>
}

interface UseUpdateTrainingRecordHandlerOptions {
  isUpdateTrainingRecordModalOpen: Ref<boolean>
  selectedTrainingRecord: Ref<TrainingRecordListItem | null>
  updateTrainingRecord: (id: string, payload: UpdateTrainingRecordPayload) => Promise<void>
}

export const useUpdateTrainingHandler = ({
  isUpdateTrainingModalOpen,
  selectedTraining,
  getTrainingById,
  updateTraining,
}: UseUpdateTrainingHandlerOptions) => {
  const closeUpdateTrainingModal = () => {
    isUpdateTrainingModalOpen.value = false
    selectedTraining.value = null
  }

  const onOpenUpdateTrainingModal = async (trainingId: string) => {
    selectedTraining.value = await getTrainingById(trainingId)
    isUpdateTrainingModalOpen.value = true
  }

  const onUpdateTraining = async (payload: UpdateTrainingPayload) => {
    const trainingId = selectedTraining.value?.id

    if (!trainingId) {
      return
    }

    await updateTraining(trainingId, payload)
    closeUpdateTrainingModal()
  }

  const selectedTrainingFormValues: ComputedRef<{
    trainingTitle: string
    trainingCategoryId: string
    statusId: string
    levelId: string
    startDate: string
    endDate: string
    defaultRemarks: string
  }> = computed(() => ({
    trainingTitle: selectedTraining.value?.trainingTitle ?? '',
    trainingCategoryId: selectedTraining.value?.trainingCategoryId ?? '',
    statusId: selectedTraining.value?.statusId ?? '',
    levelId: selectedTraining.value?.levelId ?? '',
    startDate: selectedTraining.value?.startDate ?? '',
    endDate: selectedTraining.value?.endDate ?? '',
    defaultRemarks: selectedTraining.value?.defaultRemarks ?? '',
  }))

  return {
    closeUpdateTrainingModal,
    onOpenUpdateTrainingModal,
    onUpdateTraining,
    selectedTrainingFormValues,
  }
}

export const useUpdateTrainingCategoryHandler = ({
  isUpdateTrainingCategoryModalOpen,
  selectedTrainingCategory,
  getTrainingCategoryById,
  updateTrainingCategory,
}: UseUpdateTrainingCategoryHandlerOptions) => {
  const closeUpdateTrainingCategoryModal = () => {
    isUpdateTrainingCategoryModalOpen.value = false
    selectedTrainingCategory.value = null
  }

  const onOpenUpdateTrainingCategoryModal = async (categoryId: string) => {
    selectedTrainingCategory.value = await getTrainingCategoryById(categoryId)
    isUpdateTrainingCategoryModalOpen.value = true
  }

  const onUpdateTrainingCategory = async (payload: UpdateTrainingCategoryPayload) => {
    const categoryId = selectedTrainingCategory.value?.id

    if (!categoryId) {
      return
    }

    await updateTrainingCategory(categoryId, payload)
    closeUpdateTrainingCategoryModal()
  }

  const selectedTrainingCategoryFormValues: ComputedRef<{ code: string; name: string }> = computed(() => ({
    code: selectedTrainingCategory.value?.code ?? '',
    name: selectedTrainingCategory.value?.name ?? '',
  }))

  return {
    closeUpdateTrainingCategoryModal,
    onOpenUpdateTrainingCategoryModal,
    onUpdateTrainingCategory,
    selectedTrainingCategoryFormValues,
  }
}


export const useUpdateTrainingRecordHandler = ({
  isUpdateTrainingRecordModalOpen,
  selectedTrainingRecord,
  updateTrainingRecord,
}: UseUpdateTrainingRecordHandlerOptions) => {
  const closeUpdateTrainingRecordModal = () => {
    isUpdateTrainingRecordModalOpen.value = false
    selectedTrainingRecord.value = null
  }

  const onOpenUpdateTrainingRecordModal = (record: TrainingRecordListItem) => {
    selectedTrainingRecord.value = record
    isUpdateTrainingRecordModalOpen.value = true
  }

  const onUpdateTrainingRecord = async (payload: UpdateTrainingRecordPayload) => {
    const id = selectedTrainingRecord.value?.id

    if (!id) {
      return
    }

    await updateTrainingRecord(id, payload)
    closeUpdateTrainingRecordModal()
  }

  const selectedTrainingRecordFormValues = computed(() => ({
    trainingId: selectedTrainingRecord.value?.trainingId ?? '',
    personnelId: selectedTrainingRecord.value?.personnelId ?? '',
    certificateNo: selectedTrainingRecord.value?.certificateNo ?? '',
    validUntil: selectedTrainingRecord.value?.validUntil ?? '',
    remarks: selectedTrainingRecord.value?.remarks ?? '',
  }))

  return {
    closeUpdateTrainingRecordModal,
    onOpenUpdateTrainingRecordModal,
    onUpdateTrainingRecord,
    selectedTrainingRecordFormValues,
  }
}
