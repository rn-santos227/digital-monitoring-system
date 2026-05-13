import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePersonnelStore } from '~/stores/personnel'
import type { CreatePersonnelPayload, PersonnelSearchQuery, UpdatePersonnelPayload } from '~/types/domain/personnel'

export const usePersonnel = () => {
  const personnelStore = usePersonnelStore()
  const { items, pagination, isLoading, error } = storeToRefs(personnelStore)

  const filters = ref<Partial<PersonnelSearchQuery>>({})

  const tableRows = computed(() => {
    return items.value.map((item) => ({
      id: item.id,
      personnelCode: item.personnelCode,
      serviceNumber: item.serviceNumber,
      email: item.email,
      fullName: item.fullName,
      rankName: item.rankName,
      assignment: [item.companyName, item.battalionName].filter(Boolean).join(' / ') || 'Unassigned',
      serviceStatus: item.serviceStatus,
    }))
  })

  const loadPersonnel = async (page = pagination.value.page, nextFilters: Partial<PersonnelSearchQuery> = filters.value, pageSize = pagination.value.pageSize) => {
    filters.value = { ...nextFilters }

    try {
      await personnelStore.fetchPersonnel(page, filters.value, pageSize)
    } catch {
      // Error state is exposed from the store.
    }
  }

  const createPersonnel = async (payload: CreatePersonnelPayload) => {
    await personnelStore.createPersonnel(payload)
  }

  const updatePersonnel = async (id: string, payload: UpdatePersonnelPayload) => {
    await personnelStore.updatePersonnel(id, payload)
  }

  const deletePersonnel = async (id: string) => {
    await personnelStore.deletePersonnel(id)
  }

  const getPersonnelById = async (id: string) => {
    return await personnelStore.fetchPersonnelById(id)
  }

  const uploadPersonnelBatch = async (
    file: File,
    employmentStatusId: string,
    serviceStatusId: string,
    onProgress?: (processedCount: number, totalCount: number) => void,
  ) => {
    const response = await personnelStore.processPersonnelBatchUpload(
      file,
      employmentStatusId,
      serviceStatusId,
      onProgress,
    )

    return response
  }

  return {
    filters,
    tableRows,
    pagination,
    isLoading,
    error,
    loadPersonnel,
    createPersonnel,
    updatePersonnel,
    deletePersonnel,
    getPersonnelById,
    uploadPersonnelBatch,
  }
}
