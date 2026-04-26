import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTrainingsStore } from '~/stores/trainings'
import type { TrainingCategorySearchQuery } from '~/types/domain/training'

export const useTrainingCategories = () => {
  const trainingsStore = useTrainingsStore()
  const { categories } = storeToRefs(trainingsStore)
  const filters = ref<Partial<TrainingCategorySearchQuery>>({})

  const tableRows = computed(() => {
    return categories.value.items.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      updatedAt: item.updatedAt,
    }))
  })

  const loadTrainingCategories = async (
    page = categories.value.pagination.page,
    nextFilters: Partial<TrainingCategorySearchQuery> = filters.value,
    pageSize = categories.value.pagination.pageSize,
  ) => {
    filters.value = { ...nextFilters }

    try {
      await trainingsStore.fetchTrainingCategories(page, filters.value, pageSize)
    } catch {
      // Error state is exposed from the store.
    }
  }

  onMounted(() => {
    void loadTrainingCategories(1)
  })

  return {
    filters,
    tableRows,
    pagination: computed(() => categories.value.pagination),
    isLoading: computed(() => categories.value.isLoading),
    error: computed(() => categories.value.error),
    totalItems: computed(() => categories.value.pagination.totalItems),
    loadTrainingCategories,
    createTrainingCategory: trainingsStore.createTrainingCategory,
  }
}
