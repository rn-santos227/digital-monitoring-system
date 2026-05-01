import { computed, watch } from 'vue'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import { useSuggestionSelectionHandlers, watchSuggestionsSearch } from '~/handlers/personnel/suggestions.handler'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'
import { searchDeploymentsEndpoint } from '~/utils/deployment-endpoints'

export const useDeploymentSuggestionsHandler = (modelValue: () => string | null) => {
  const handlers = useSuggestionSelectionHandlers<DeploymentManagementListItem>((item) => item.operationName)

  const suggestionOptions = computed<SuggestionFieldOption[]>(() => {
    return handlers.suggestions.value.map((item) => ({
      value: item.id,
      label: item.operationName,
      description: [item.deploymentArea, item.status ?? 'No status'].join(' • '),
    }))
  })

  const fetchSuggestions = async () => {
    const response = await searchDeploymentsEndpoint({
      term: handlers.searchTerm.value,
      fields: 'operationName',
      pageSize: 10,
    })

    handlers.suggestions.value = response.items
  }

  watch(modelValue, async (nextValue) => {
    if (nextValue && !handlers.suggestions.value.some(item => item.id === nextValue)) {
      await fetchSuggestions()
    }
  }, { immediate: true })

  watchSuggestionsSearch(handlers.searchTerm, fetchSuggestions)

  return {
    ...handlers,
    suggestionOptions,
  }
}
