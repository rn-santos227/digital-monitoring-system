import type { Ref } from 'vue'
import type { 
  EquipmentAssetSearchQuery,
  EquipmentCategorySearchQuery,
  EquipmentIssuanceSearchQuery,
  EquipmentItemSearchQuery
} from '~/types/domain/equipment'
type EquipmentFilters = Partial<EquipmentCategorySearchQuery> | Partial<EquipmentItemSearchQuery> | Partial<EquipmentAssetSearchQuery> | Partial<EquipmentIssuanceSearchQuery>

export const useEquipmentPageHandlers = (
  filters: Ref<EquipmentFilters>,
) => {
  const handleFilterApply = (value: EquipmentFilters) => {
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

export const useEquipmentCategoryPageHandlers = (
  filters: Ref<Partial<EquipmentCategorySearchQuery>>,
) => {
  return useEquipmentPageHandlers(filters as Ref<EquipmentFilters>)
}
