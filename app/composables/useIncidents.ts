import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useIncidentsStore } from '~/stores/incidents'
import type { EquipmentIncidentSearchQuery, EquipmentIncidentTableRow } from '~/types/domain/incident'
import { hasEquipmentIncidentSearchFilters } from '~/utils/incident-endpoints'

export const useIncidents = () => {
  const store = useIncidentsStore()
  const { items, kpis, pagination, isLoading, error } = storeToRefs(store)
  const filters = ref<Partial<EquipmentIncidentSearchQuery>>({})

  const hasActiveFilters = computed(() => hasEquipmentIncidentSearchFilters(filters.value))
  const tableRows = computed<EquipmentIncidentTableRow[]>(() => [...items.value])


}
