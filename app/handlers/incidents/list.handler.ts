import type { Ref } from 'vue'
import type { EquipmentIncidentSearchQuery } from '~/types/domain/incident'

interface UseIncidentListHandlersOptions {
  filters: Ref<Partial<EquipmentIncidentSearchQuery>>
  loadPage: (page?: number, filters?: Partial<EquipmentIncidentSearchQuery>, pageSize?: number) => Promise<unknown>
  handleFilterApply: (value: Partial<EquipmentIncidentSearchQuery>) => { filters: Partial<EquipmentIncidentSearchQuery>; isValid: boolean }
  handleFilterReset: () => Partial<EquipmentIncidentSearchQuery>
}

