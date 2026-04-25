import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useBattalionsStore } from '~/stores/battalions'
import type { BattalionSearchQuery } from '~/types/domain/units'

export const useBattalions = () => {
  const battalionsStore = useBattalionsStore()
  const { items, pagination, isLoading, error } = storeToRefs(battalionsStore)
  const filters = ref<Partial<BattalionSearchQuery>>({})

  const tableRows = computed(() => {
    return items.value.map((item) => ({
      id: item.id,
      code: item.code,
      name: item.name,
      status: item.isActive ? 'Active' : 'Inactive',
      companyCount: item.companyCount,
    }))
  })

  const loadBattalions = async (page = pagination.value.page, nextFilters: Partial<BattalionSearchQuery> = filters.value) => {
    filters.value = { ...nextFilters }

    try {
      await battalionsStore.fetchBattalions(page, filters.value)
    } catch {
      // Error state is exposed from the store.
    }
  }

  onMounted(() => {
    void loadBattalions(1)
  })

  return {
    filters,
    tableRows,
    pagination,
    isLoading,
    error,
    loadBattalions,
    createBattalion: battalionsStore.createBattalion,
    getBattalionById: battalionsStore.getBattalionById,
    updateBattalion: battalionsStore.updateBattalion,
    deleteBattalion: battalionsStore.deleteBattalion,
  }
}
