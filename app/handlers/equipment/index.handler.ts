import type { Ref } from 'vue'
import type { EquipmentCategorySearchQuery } from '~/types/domain/equipment'

export const useEquipmentCategoryPageHandlers = (
  filters: Ref<Partial<EquipmentCategorySearchQuery>>,
) => {
  const handleFilterApply = (
    value: Partial<EquipmentCategorySearchQuery>,
  ): Partial<EquipmentCategorySearchQuery> => {
    filters.value = { ...value }
    return filters.value
  }

  const handleFilterReset = (): Partial<EquipmentCategorySearchQuery> => {
    const resetFilters: Partial<EquipmentCategorySearchQuery> = {}
    filters.value = resetFilters
    return resetFilters
  }

  return {
    handleFilterApply,
    handleFilterReset,
  }
}
