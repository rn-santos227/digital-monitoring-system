import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePersonnelStore } from '~/stores/personnel'
import type { CreatePersonnelPayload, PersonnelSearchQuery } from '~/types/domain/personnel'

export const usePersonnel = () => {
  const personnelStore = usePersonnelStore()
  const { items, pagination, isLoading, error } = storeToRefs(personnelStore)

  const filters = ref<Partial<PersonnelSearchQuery>>({})

  const tableRows = computed(() => {
    return items.value.map((item) => ({
      id: item.id,
      personnelCode: item.personnelCode,
      serviceNumber: item.serviceNumber,
      fullName: item.fullName,
      rankName: item.rankName,
      assignment: [item.companyName, item.battalionName].filter(Boolean).join(' / ') || 'Unassigned',
      serviceStatus: item.serviceStatus,
    }))
  })

  const loadPersonnel = async (page = pagination.value.page, nextFilters: Partial<PersonnelSearchQuery> = filters.value) => {
    filters.value = { ...nextFilters }

    try {
      await personnelStore.fetchPersonnel(page, filters.value)
    } catch {
      // Error state is exposed from the store.
    }
  }

  const createPersonnel = async (payload: CreatePersonnelPayload) => {
    await personnelStore.createPersonnel(payload)
    await loadPersonnel(1, filters.value)
  }

  return {
    filters,
    tableRows,
    pagination,
    isLoading,
    error,
    loadPersonnel,
    createPersonnel,
  }
}
