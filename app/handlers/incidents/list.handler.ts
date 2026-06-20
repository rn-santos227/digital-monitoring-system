import type { Ref } from 'vue'
import type { EquipmentIncidentSearchQuery } from '~/types/domain/incident'

interface UseIncidentListHandlersOptions {
  filters: Ref<Partial<EquipmentIncidentSearchQuery>>
  loadPage: (page?: number, filters?: Partial<EquipmentIncidentSearchQuery>, pageSize?: number) => Promise<unknown>
  handleFilterApply: (value: Partial<EquipmentIncidentSearchQuery>) => { filters: Partial<EquipmentIncidentSearchQuery>; isValid: boolean }
  handleFilterReset: () => Partial<EquipmentIncidentSearchQuery>
}

export const useIncidentListHandlers = ({
  filters,
  loadPage,
  handleFilterApply,
  handleFilterReset,
}: UseIncidentListHandlersOptions) => {
  const onApply = async (value: Partial<EquipmentIncidentSearchQuery>) => {
    const result = handleFilterApply(value)
    if (!result.isValid) return
    await loadPage(1, result.filters)
  }

  const onReset = async () => {
    await loadPage(1, handleFilterReset())
  }


  const onPageChange = async (page: number) => {
    await loadPage(page)
  }

}
