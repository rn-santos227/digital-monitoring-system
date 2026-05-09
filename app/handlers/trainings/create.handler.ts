import type { Ref } from 'vue'
import type {
  CreateTrainingCategoryPayload,
  CreateTrainingPayload,
  CreateTrainingRecordPayload,
} from '~/types/domain/training'

interface UseCreateTrainingHandlerOptions {
  isCreateTrainingModalOpen: Ref<boolean>
  createTraining: (payload: CreateTrainingPayload) => Promise<{ id: string }>
  kpiRefreshKey: Ref<number>
}

interface UseCreateTrainingCategoryHandlerOptions {
  isCreateTrainingCategoryModalOpen: Ref<boolean>
  createTrainingCategory: (payload: CreateTrainingCategoryPayload) => Promise<{ id: string }>
}

interface UseCreateTrainingRecordHandlerOptions {
  isCreateTrainingRecordModalOpen: Ref<boolean>
  createTrainingRecord: (payload: CreateTrainingRecordPayload) => Promise<{ id: string }>
  kpiRefreshKey: Ref<number>
}

export const useCreateTrainingHandler = ({
  isCreateTrainingModalOpen,
  createTraining,
  kpiRefreshKey,
}: UseCreateTrainingHandlerOptions) => {
  const onOpenCreateTrainingModal = () => {
    isCreateTrainingModalOpen.value = true
  }

  const onCloseCreateTrainingModal = () => {
    isCreateTrainingModalOpen.value = false
  }

  const onCreateTraining = async (payload: CreateTrainingPayload) => {
    await createTraining(payload)
    onCloseCreateTrainingModal()
    kpiRefreshKey.value += 1
  }

  return {
    onOpenCreateTrainingModal,
    onCloseCreateTrainingModal,
    onCreateTraining,
  }
}

export const useCreateTrainingCategoryHandler = ({
  isCreateTrainingCategoryModalOpen,
  createTrainingCategory,
}: UseCreateTrainingCategoryHandlerOptions) => {
  const onOpenCreateTrainingCategoryModal = () => {
    isCreateTrainingCategoryModalOpen.value = true
  }

  const onCloseCreateTrainingCategoryModal = () => {
    isCreateTrainingCategoryModalOpen.value = false
  }

  const onCreateTrainingCategory = async (payload: CreateTrainingCategoryPayload) => {
    await createTrainingCategory(payload)
    onCloseCreateTrainingCategoryModal()
  }

  return {
    onOpenCreateTrainingCategoryModal,
    onCloseCreateTrainingCategoryModal,
    onCreateTrainingCategory,
  }
}


export const useCreateTrainingRecordHandler = ({
  isCreateTrainingRecordModalOpen,
  createTrainingRecord,
  kpiRefreshKey,
}: UseCreateTrainingRecordHandlerOptions) => {
  const onOpenCreateTrainingRecordModal = () => {
    isCreateTrainingRecordModalOpen.value = true
  }

  const onCloseCreateTrainingRecordModal = () => {
    isCreateTrainingRecordModalOpen.value = false
  }

  const onCreateTrainingRecord = async (payload: CreateTrainingRecordPayload) => {
    await createTrainingRecord(payload)
    onCloseCreateTrainingRecordModal()
    kpiRefreshKey.value += 1
  }

  return {
    onOpenCreateTrainingRecordModal,
    onCloseCreateTrainingRecordModal,
    onCreateTrainingRecord,
  }
}
