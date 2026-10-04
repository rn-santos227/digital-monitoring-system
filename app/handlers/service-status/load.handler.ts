import type { Ref } from 'vue'
import type { PersonnelLocationItem } from '~/types/domain/personnel'
import { fetchPersonnelLocationsEndpoint } from '~/utils/service-status-endpoints'

interface UseServiceStatusLocationHandlersOptions {
  isLoading: Ref<boolean>
  errorMessage: Ref<string>
  locationItems: Ref<PersonnelLocationItem[]>
  selectedPersonnelId: Ref<string | null>
  filteredLocationItems: Readonly<Ref<PersonnelLocationItem[]>>
  printServiceStatusPersonnel: (items: readonly PersonnelLocationItem[]) => unknown
}

export const useServiceStatusLocationHandlers = ({
  isLoading,
  errorMessage,
  locationItems,
  selectedPersonnelId,
  filteredLocationItems,
  printServiceStatusPersonnel,
}: UseServiceStatusLocationHandlersOptions) => {
  const loadLocations = async () => {
    isLoading.value = true
    errorMessage.value = ''

    try {
      locationItems.value = await fetchPersonnelLocationsEndpoint()
      selectedPersonnelId.value = locationItems.value[0]?.personnelId ?? null
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to load personnel locations.'
      errorMessage.value = message
    } finally {
      isLoading.value = false
    }
  }

  const handlePrintServiceStatusPersonnel = async (): Promise<readonly PersonnelLocationItem[]> => {
    await loadLocations()
    const completeItems = [...filteredLocationItems.value]
    printServiceStatusPersonnel(completeItems)
    return completeItems
  }

  return {
    loadLocations,
    handlePrintServiceStatusPersonnel,
  }
}
