import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentItemsStore } from '~/stores/equipment'
import type { EquipmentItemSearchQuery, EquipmentItemTableRow } from '~/types/domain/equipment'
import { hasEquipmentItemSearchFilters } from '~/utils/equipment-endpoints'

export const useEquipmentItems = () => {
  const store = useEquipmentItemsStore()
  const { items, kpis, pagination, isLoading, error } = storeToRefs(store)
  const filters = ref<Partial<EquipmentItemSearchQuery>>({})

  const hasActiveFilters = computed(() => {
    return hasEquipmentItemSearchFilters(filters.value)
  })

  const tableRows = computed<EquipmentItemTableRow[]>(() => {
    return items.value.map((item) => ({
      ...item,
      status: item.isActive ? 'Active' : 'Inactive',
    }))
  })

  const loadEquipmentItems = async (
    page = pagination.value.page,
    nextFilters: Partial<EquipmentItemSearchQuery> = filters.value,
    pageSize = pagination.value.pageSize,
  ) => {
    filters.value = { ...nextFilters }
    await store.fetchEquipmentItems(page, filters.value, pageSize)
  }

  onMounted(() => {
    void store.fetchEquipmentItemKpisOnce().catch(() => {})
    void loadEquipmentItems(1)
  })

  return {
    filters,
    hasActiveFilters,
    tableRows,
    kpis,
    pagination,
    isLoading,
    error,
    loadEquipmentItems,
    createEquipmentItem: store.createEquipmentItem,
    getEquipmentItemById: store.getEquipmentItemById,
    updateEquipmentItem: store.updateEquipmentItem,
    deleteEquipmentItem: store.deleteEquipmentItem,
  }
}
