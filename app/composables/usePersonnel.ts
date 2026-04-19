import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { usePersonnelStore } from '~/stores/personnel'
import type { PersonnelSearchQuery } from '~/types/domain/personnel'

export const usePersonnel = () => {
  const personnelStore = usePersonnelStore()
  const { items, pagination, isLoading, error } = storeToRefs(personnelStore)

  const filters = ref<Partial<PersonnelSearchQuery>>({})

  const tableRows = computed(() => {
    return items.value.map((item) => ({
      id: item.id,
      avatarAlt: item.fullName,
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

  return {
    filters,
    tableRows,
    pagination,
    isLoading,
    error,
    loadPersonnel,
  }
}
