import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentCategoriesStore } from '~/stores/equipment'
import type { EquipmentCategorySearchQuery } from '~/types/domain/equipment'

export const useEquipmentCategories = () => {
  const store = useEquipmentCategoriesStore()
  const { items, pagination, isLoading, error } = storeToRefs(store)
  const filters = ref<Partial<EquipmentCategorySearchQuery>>({})

  const tableRows = computed(() => {
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
}
