import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentIssuancesStore } from '~/stores/equipment'
import type { EquipmentIssuanceSearchQuery, EquipmentIssuanceTableRow } from '~/types/domain/equipment'
import { hasEquipmentIssuanceSearchFilters } from '~/utils/equipment-endpoints'

export const useEquipmentIssuances = () => {
  const store = useEquipmentIssuancesStore()
  const { items, pagination, isLoading, error } = storeToRefs(store)
  const filters = ref<Partial<EquipmentIssuanceSearchQuery>>({})

  const hasActiveFilters = computed(() => hasEquipmentIssuanceSearchFilters(filters.value))
  const tableRows = computed<EquipmentIssuanceTableRow[]>(() => [...items.value])

  const loadEquipmentIssuances = async (
    page = pagination.value.page,
    nextFilters: Partial<EquipmentIssuanceSearchQuery> = filters.value,
    pageSize = pagination.value.pageSize,
  ) => {
    filters.value = { ...nextFilters }
    await store.fetchEquipmentIssuances(page, filters.value, pageSize)
  }

}
