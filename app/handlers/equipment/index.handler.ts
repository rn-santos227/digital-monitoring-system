import type { Ref } from 'vue'
import type { EquipmentCategorySearchQuery } from '~/types/domain/equipment'

export const useEquipmentCategoryPageHandlers = (
  filters: Ref<Partial<EquipmentCategorySearchQuery>>,
) => {
  const handleFilterApply = (value: Partial<EquipmentCategorySearchQuery>) => {
    filters.value = { ...value }
    return filters.value
  }

  const handleFilterReset = () => {
    filters.value = {}
    return filters.value
  }

  return {
    handleFilterApply,
    handleFilterReset,
  }
}
