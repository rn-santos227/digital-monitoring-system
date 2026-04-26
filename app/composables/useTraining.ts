import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTrainingsStore } from '~/stores/trainings'
import type { TrainingSearchQuery } from '~/types/domain/training'

export const useTrainings = () => {
  const trainingsStore = useTrainingsStore()
  const { trainings } = storeToRefs(trainingsStore)
  const filters = ref<Partial<TrainingSearchQuery>>({})

  const tableRows = computed(() => {
    return trainings.value.items.map((item) => ({
      id: item.id,
      trainingTitle: item.trainingTitle,
      trainingCategoryName: item.trainingCategoryName ?? '—',
      levelName: item.levelName ?? '—',
      statusName: item.statusName ?? '—',
      startDate: item.startDate ?? '—',
      endDate: item.endDate ?? '—',
    }))
  })

  const loadTrainings = async (page = trainings.value.pagination.page, nextFilters: Partial<TrainingSearchQuery> = filters.value, pageSize = trainings.value.pagination.pageSize) => {
    filters.value = { ...nextFilters }

    try {
      await trainingsStore.fetchTrainings(page, filters.value, pageSize)
    } catch {
      // Error state is exposed from the store.
    }
  }

  onMounted(() => {
    void loadTrainings(1)
  })

  return {
    filters,
    tableRows,
    pagination: computed(() => trainings.value.pagination),
    isLoading: computed(() => trainings.value.isLoading),
    error: computed(() => trainings.value.error),
    totalItems: computed(() => trainings.value.pagination.totalItems),
    loadTrainings,
  }
}
