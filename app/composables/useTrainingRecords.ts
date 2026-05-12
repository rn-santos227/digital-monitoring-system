import { storeToRefs } from 'pinia'
import { useTrainingsStore } from '~/stores/trainings'
import type { TrainingRecordSearchQuery } from '~/types/domain/training'

export const useTrainingRecords = () => {
  const trainingsStore = useTrainingsStore()
  const { records } = storeToRefs(trainingsStore)
  const filters = ref<Partial<TrainingRecordSearchQuery>>({})

  const tableRows = computed(() => {
    return records.value.items.map((item) => ({
      id: item.id,
      recordNo: item.recordNo,
      personnelCode: item.personnelCode ?? '—',
      personnelName: item.personnelName ?? '—',
      trainingTitle: item.trainingTitle,
      trainingCategoryName: item.trainingCategoryName ?? '—',
      statusName: item.statusName ?? '—',
      certificateNo: item.certificateNo ?? '—',
      validUntil: item.validUntil ?? '—',
    }))
  })

  const loadTrainingRecords = async (
    page = records.value.pagination.page,
    nextFilters: Partial<TrainingRecordSearchQuery> = filters.value,
    pageSize = records.value.pagination.pageSize,
  ) => {
    filters.value = { ...nextFilters }

    try {
       await trainingsStore.fetchTrainingRecords(page, filters.value, pageSize)
    } catch {
      // Error state is exposed from the store.
    }
  }

  const createTrainingRecord = async (payload: Parameters<typeof trainingsStore.createTrainingRecord>[0]) => {
    return await trainingsStore.createTrainingRecord(payload)
  }

  const updateTrainingRecord = async (id: string, payload: Parameters<typeof trainingsStore.updateTrainingRecord>[1]) => {
    await trainingsStore.updateTrainingRecord(id, payload)
  }

  const deleteTrainingRecord = async (id: string) => {
    await trainingsStore.deleteTrainingRecord(id)
  }

  return {
    filters,
    tableRows,
    pagination: computed(() => records.value.pagination),
    isLoading: computed(() => records.value.isLoading),
    error: computed(() => records.value.error),
    totalItems: computed(() => records.value.pagination.totalItems),
    loadTrainingRecords,
    createTrainingRecord,
    updateTrainingRecord,
    deleteTrainingRecord,
    records: computed(() => records.value.items),
  }
}
