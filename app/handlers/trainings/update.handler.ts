import { computed } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type {
  TrainingCategoryListItem,
  TrainingCategorySearchQuery,
  TrainingListItem,
  TrainingSearchQuery,
  UpdateTrainingCategoryPayload,
  UpdateTrainingPayload,
} from '~/types/domain/training'

interface UseUpdateTrainingHandlerOptions {
  isUpdateTrainingModalOpen: Ref<boolean>
  selectedTraining: Ref<TrainingListItem | null>
  getTrainingById: (id: string) => Promise<TrainingListItem>
  updateTraining: (id: string, payload: UpdateTrainingPayload) => Promise<void>
  loadTrainings: (page?: number, nextFilters?: Partial<TrainingSearchQuery>, pageSize?: number) => Promise<void>
  trainingFilters: Ref<Partial<TrainingSearchQuery>>
  kpiRefreshKey: Ref<number>
}

interface UseUpdateTrainingCategoryHandlerOptions {
  isUpdateTrainingCategoryModalOpen: Ref<boolean>
  selectedTrainingCategory: Ref<TrainingCategoryListItem | null>
  getTrainingCategoryById: (id: string) => Promise<TrainingCategoryListItem>
  updateTrainingCategory: (id: string, payload: UpdateTrainingCategoryPayload) => Promise<void>
  loadTrainingCategories: (page?: number, nextFilters?: Partial<TrainingCategorySearchQuery>, pageSize?: number) => Promise<void>
  categoryFilters: Ref<Partial<TrainingCategorySearchQuery>>
  kpiRefreshKey: Ref<number>
}

export const useUpdateTrainingHandler = ({
  isUpdateTrainingModalOpen,
  selectedTraining,
  getTrainingById,
  updateTraining,
  loadTrainings,
  trainingFilters,
  kpiRefreshKey,
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
    await loadTrainings(1, trainingFilters.value)
    kpiRefreshKey.value += 1
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
  loadTrainingCategories,
  categoryFilters,
  kpiRefreshKey,
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
    await loadTrainingCategories(1, categoryFilters.value)
    kpiRefreshKey.value += 1
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
