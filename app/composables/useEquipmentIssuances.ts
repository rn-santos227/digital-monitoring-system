import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useEquipmentIssuancesStore } from '~/stores/equipment'
import type { EquipmentIssuanceSearchQuery, EquipmentIssuanceTableRow } from '~/types/domain/equipment'
import { hasEquipmentIssuanceSearchFilters } from '~/utils/equipment-endpoints'

export const useEquipmentIssuances = () => {
  const store = useEquipmentIssuancesStore()
  const { items, pagination, isLoading, error } = storeToRefs(store)
  const filters = ref<Partial<EquipmentIssuanceSearchQuery>>({})

}
