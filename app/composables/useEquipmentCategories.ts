import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentCategoriesStore } from '~/stores/equipment-categories'
import type { EquipmentCategorySearchQuery, EquipmentCategoryTableRow } from '~/types/domain/equipment'
import { hasEquipmentCategorySearchFilters } from '~/utils/equipment-endpoints'

export const useEquipmentCategories = () => {
  const store = useEquipmentCategoriesStore()
  const { items, kpis, pagination, isLoading, error } = storeToRefs(store)
  const filters = ref<Partial<EquipmentCategorySearchQuery>>({})

  const hasActiveFilters = computed(() => {
    return hasEquipmentCategorySearchFilters(filters.value)
  })

  const tableRows = computed<EquipmentCategoryTableRow[]>(() => {
    return items.value.map((item) => ({
      ...item,
      status: item.isActive ? 'Active' : 'Inactive',
    }))
  })

  const loadEquipmentCategories = async (
    page = pagination.value.page,
    nextFilters: Partial<EquipmentCategorySearchQuery> = filters.value,
    pageSize = pagination.value.pageSize,
  ) => {
    filters.value = { ...nextFilters }
    await store.fetchEquipmentCategories(page, filters.value, pageSize)
  }

  onMounted(() => {
    void store.fetchEquipmentCategoryKpisOnce().catch(() => {})
    void loadEquipmentCategories(1)
  })

  return {
    filters,
    hasActiveFilters,
    tableRows,
    kpis,
    pagination,
    isLoading,
    error,
    loadEquipmentCategories,
    createEquipmentCategory: store.createEquipmentCategory,
    getEquipmentCategoryById: store.getEquipmentCategoryById,
    updateEquipmentCategory: store.updateEquipmentCategory,
    deleteEquipmentCategory: store.deleteEquipmentCategory,
  }
}
