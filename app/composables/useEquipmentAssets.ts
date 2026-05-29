import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentAssetsStore } from '~/stores/equipment'
import type { EquipmentAssetSearchQuery, EquipmentAssetTableRow } from '~/types/domain/equipment'
import { hasEquipmentAssetSearchFilters } from '~/utils/equipment-endpoints'

export const useEquipmentAssets = () => {
  const store = useEquipmentAssetsStore()
  const { items, kpis, pagination, isLoading, error } = storeToRefs(store)
  const filters = ref<Partial<EquipmentAssetSearchQuery>>({})

  const hasActiveFilters = computed(() => hasEquipmentAssetSearchFilters(filters.value))
  const tableRows = computed<EquipmentAssetTableRow[]>(() => [...items.value])

  const loadEquipmentAssets = async (
    page = pagination.value.page,
    nextFilters: Partial<EquipmentAssetSearchQuery> = filters.value,
    pageSize = pagination.value.pageSize,
  ) => {
    filters.value = { ...nextFilters }
    await store.fetchEquipmentAssets(page, filters.value, pageSize)
  }

  onMounted(() => {
    void store.fetchEquipmentAssetKpisOnce().catch(() => {})
    void loadEquipmentAssets(1)
  })

  return {
    filters,
    hasActiveFilters,
    tableRows,
    kpis,
    pagination,
    isLoading,
    error,
    loadEquipmentAssets,
    createEquipmentAsset: store.createEquipmentAsset,
    getEquipmentAssetById: store.getEquipmentAssetById,
    updateEquipmentAsset: store.updateEquipmentAsset,
    deleteEquipmentAsset: store.deleteEquipmentAsset,
  }
}
