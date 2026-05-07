import { computed, ref } from 'vue'
import { createTrainingRecordEndpoint, deleteTrainingRecordEndpoint, getTrainingRecordsEndpoint, searchTrainingRecordsEndpoint, updateTrainingRecordEndpoint } from '~/utils/training-endpoints'
import type {
  CreateTrainingRecordPayload,
  TrainingEndpointQuery,
  TrainingRecordListItem,
  TrainingRecordSearchQuery,
  TrainingTablePagination,
  UpdateTrainingRecordPayload,
} from '~/types/domain/training'

const DEFAULT_PAGINATION: TrainingTablePagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0,
}

export const useTrainingRecords = () => {
  const records = ref<TrainingRecordListItem[]>([])
  const filters = ref<Partial<TrainingRecordSearchQuery>>({})
  const pagination = ref<TrainingTablePagination>({ ...DEFAULT_PAGINATION })
  const isLoading = ref(false)
  const error = ref('')

  const tableRows = computed(() => {
    return records.value.map((item) => ({
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
    page = pagination.value.page,
    nextFilters: Partial<TrainingRecordSearchQuery> = filters.value,
    pageSize = pagination.value.pageSize,
  ) => {
    isLoading.value = true
    error.value = ''
    filters.value = { ...nextFilters }

    const query: TrainingEndpointQuery = {
      page,
      pageSize,
      search: filters.value.term ?? '',
    }

    try {
      const response = filters.value.term
        ? await searchTrainingRecordsEndpoint({
          page,
          pageSize,
          term: filters.value.term,
          fields: filters.value.fields,
        })
        : await getTrainingRecordsEndpoint(query)

      records.value = response.items
      pagination.value = {
        page: response.page,
        pageSize: response.pageSize,
        totalItems: response.totalItems,
        totalPages: response.totalPages,
      }
    } catch (loadError) {
      records.value = []
      pagination.value = {
        page,
        pageSize,
        totalItems: 0,
        totalPages: 0,
      }
      error.value = loadError instanceof Error ? loadError.message : 'Failed to fetch training records.'
    } finally {
      isLoading.value = false
    }
  }

  const createTrainingRecord = async (payload: CreateTrainingRecordPayload): Promise<{ id: string }> => {
    const response = await createTrainingRecordEndpoint(payload)
    const now = new Date().toISOString()
    records.value = [
      ...records.value,
      {
        id: response.id,
        recordNo: '—',
        personnelId: payload.personnelId,
        personnelCode: null,
        personnelName: null,
        trainingId: payload.trainingId,
        trainingTitle: '—',
        trainingCategoryId: null,
        trainingCategoryName: null,
        levelId: null,
        levelName: null,
        statusId: '',
        statusName: null,
        startDate: null,
        endDate: null,
        certificateNo: payload.certificateNo ?? null,
        validUntil: payload.validUntil ?? null,
        remarks: payload.remarks ?? null,
        createdAt: now,
        updatedAt: now,
      },
    ]
    pagination.value.totalItems += 1
    pagination.value.totalPages = Math.max(1, Math.ceil(pagination.value.totalItems / pagination.value.pageSize))
    return { id: response.id }
  }

  const updateTrainingRecord = async (id: string, payload: UpdateTrainingRecordPayload) => {
    records.value = records.value.map((item) => {
      if (item.id !== id) {
        return item
      }

      return {
        ...item,
        trainingId: payload.trainingId ?? item.trainingId,
        personnelId: payload.personnelId ?? item.personnelId,
        certificateNo: payload.certificateNo ?? item.certificateNo,
        validUntil: payload.validUntil ?? item.validUntil,
        remarks: payload.remarks ?? item.remarks,
        updatedAt: new Date().toISOString(),
      }
    })
  }

  const deleteTrainingRecord = async (id: string) => {
    await deleteTrainingRecordEndpoint(id)
  }

  return {
    filters,
    tableRows,
    pagination: computed(() => pagination.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    totalItems: computed(() => pagination.value.totalItems),
    loadTrainingRecords,
    createTrainingRecord,
    updateTrainingRecord,
    deleteTrainingRecord,
    records: computed(() => records.value),
  }
}
