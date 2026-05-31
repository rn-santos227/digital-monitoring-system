import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useTrainingsStore } from '~/stores/trainings'
import type { TrainingSearchQuery } from '~/types/domain/training'

export const useTrainings = () => {
  const trainingsStore = useTrainingsStore()
  const { trainings, kpis } = storeToRefs(trainingsStore)
  const filters = ref<Partial<TrainingSearchQuery>>({})

  const tableRows = computed(() => {
    return trainings.value.items.map((item) => ({
      id: item.id,
      trainingTitle: item.trainingTitle,
      trainingCategoryId: item.trainingCategoryId ?? null,
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
    void trainingsStore.fetchTrainingManagementKpisOnce().catch(() => {})
    void loadTrainings(1)
  })

  const createTraining = async (payload: Parameters<typeof trainingsStore.createTraining>[0]) => {
    return await trainingsStore.createTraining(payload)
  }

  const updateTraining = async (id: string, payload: Parameters<typeof trainingsStore.updateTraining>[1]) => {
    await trainingsStore.updateTraining(id, payload)
  }

  const deleteTraining = async (id: string) => {
    await trainingsStore.deleteTraining(id)
  }

  return {
    filters,
    tableRows,
    kpis,
    pagination: computed(() => trainings.value.pagination),
    isLoading: computed(() => trainings.value.isLoading),
    error: computed(() => trainings.value.error),
    totalItems: computed(() => trainings.value.pagination.totalItems),
    loadTrainings,
    createTraining,
    updateTraining,
    deleteTraining,
    getTrainingById: trainingsStore.getTrainingById,
  }
}
