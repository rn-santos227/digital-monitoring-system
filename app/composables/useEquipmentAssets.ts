import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentAssetsStore } from '~/stores/equipment'
import type { EquipmentAssetSearchQuery, EquipmentAssetTableRow } from '~/types/domain/equipment'
import { hasEquipmentAssetSearchFilters } from '~/utils/equipment-endpoints'

export const useEquipmentAssets = () => {
  const store = useEquipmentAssetsStore()
  const { items, pagination, isLoading, error } = storeToRefs(store)
  const filters = ref<Partial<EquipmentAssetSearchQuery>>({})

  const hasActiveFilters = computed(() => hasEquipmentAssetSearchFilters(filters.value))
  const tableRows = computed<EquipmentAssetTableRow[]>(() => [...items.value])


}
