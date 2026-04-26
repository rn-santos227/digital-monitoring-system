import type { Ref } from 'vue'
import type {
  CreateTrainingCategoryPayload,
  CreateTrainingPayload,
  TrainingCategorySearchQuery,
  TrainingSearchQuery,
} from '~/types/domain/training'

interface UseCreateTrainingHandlerOptions {
  isCreateTrainingModalOpen: Ref<boolean>
  createTraining: (payload: CreateTrainingPayload) => Promise<void>
  loadTrainings: (page?: number, nextFilters?: Partial<TrainingSearchQuery>, pageSize?: number) => Promise<void>
  trainingFilters: Ref<Partial<TrainingSearchQuery>>
  kpiRefreshKey: Ref<number>
}

interface UseCreateTrainingCategoryHandlerOptions {
  isCreateTrainingCategoryModalOpen: Ref<boolean>
  createTrainingCategory: (payload: CreateTrainingCategoryPayload) => Promise<void>
  loadTrainingCategories: (page?: number, nextFilters?: Partial<TrainingCategorySearchQuery>, pageSize?: number) => Promise<void>
  categoryFilters: Ref<Partial<TrainingCategorySearchQuery>>
  kpiRefreshKey: Ref<number>
}

export const useCreateTrainingHandler = ({
  isCreateTrainingModalOpen,
  createTraining,
  loadTrainings,
  trainingFilters,
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
    await loadTrainings(1, trainingFilters.value)
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
  loadTrainingCategories,
  categoryFilters,
  kpiRefreshKey,
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
    await loadTrainingCategories(1, categoryFilters.value)
    kpiRefreshKey.value += 1
  }

  return {
    onOpenCreateTrainingCategoryModal,
    onCloseCreateTrainingCategoryModal,
    onCreateTrainingCategory,
  }
}
