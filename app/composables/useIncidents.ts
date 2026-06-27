import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useIncidentsStore } from '~/stores/incidents'
import type { EquipmentIncidentSearchQuery, EquipmentIncidentTableRow } from '~/types/domain/incident'
import { hasEquipmentIncidentSearchFilters } from '~/utils/incident-endpoints'

export const useIncidents = () => {
  const store = useIncidentsStore()
  const { items, kpis, pagination, isLoading, isCreating, isUpdating, error, createError, updateError } = storeToRefs(store)
  const filters = ref<Partial<EquipmentIncidentSearchQuery>>({})

  const hasActiveFilters = computed(() => hasEquipmentIncidentSearchFilters(filters.value))
  const tableRows = computed<EquipmentIncidentTableRow[]>(() => [...items.value])

  const loadEquipmentIncidents = async (
    page = pagination.value.page,
    nextFilters: Partial<EquipmentIncidentSearchQuery> = filters.value,
    pageSize = pagination.value.pageSize,
  ) => {
    filters.value = { ...nextFilters }
    await store.fetchEquipmentIncidents(page, filters.value, pageSize)
  }

  onMounted(() => {
    void store.fetchEquipmentIncidentKpisOnce().catch(() => {})
    void loadEquipmentIncidents(1)
  })

  return {
    filters,
    hasActiveFilters,
    tableRows,
    kpis,
    pagination,
    isLoading,
    isCreating,
    error,
    createError,
    loadEquipmentIncidents,
    createEquipmentIncident: store.createEquipmentIncident,
    getEquipmentIncidentById: store.getEquipmentIncidentById,
    updateEquipmentIncident: store.updateEquipmentIncident,
    deleteEquipmentIncident: store.deleteEquipmentIncident,
  }
}
