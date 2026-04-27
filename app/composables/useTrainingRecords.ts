import { computed, ref } from 'vue'
import { getTrainingRecordsEndpoint, searchTrainingRecordsEndpoint } from '~/utils/training-endpoints'
import type {
  TrainingEndpointQuery,
  TrainingRecordListItem,
  TrainingRecordSearchQuery,
  TrainingTablePagination,
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

  return {
    filters,
    tableRows,
    pagination: computed(() => pagination.value),
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    totalItems: computed(() => pagination.value.totalItems),
    loadTrainingRecords,
  }
}
