import { computed, watch } from 'vue'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import { useSuggestionSelectionHandlers, watchSuggestionsSearch } from '~/handlers/personnel/suggestions.handler'
import type { CompanyListItem } from '~/types/domain/units'
import { getCompanySuggestionsEndpoint } from '~/utils/units-endpoints'

export const useCompanySuggestionsHandler = (
  battalionId: () => string | null | undefined,
  modelValue: () => string | null
) => {
  const handlers = useSuggestionSelectionHandlers<CompanyListItem>((item) => `${item.code} • ${item.name}`)

  const suggestionOptions = computed<SuggestionFieldOption[]>(() => {
    return handlers.suggestions.value.map((item) => ({
      value: item.id,
      label: `${item.code} • ${item.name}`,
      description: item.battalionName ? `Battalion: ${item.battalionName}` : 'No battalion assigned',
    }))
  })

  const fetchSuggestions = async () => {
    const response = await getCompanySuggestionsEndpoint({
      term: handlers.searchTerm.value,
      battalionId: battalionId() ?? undefined,
      pageSize: 10,
      selectedId: modelValue() ?? undefined,
    })

    handlers.suggestions.value = response.items
  }

  watch(modelValue, async (nextValue) => {
    if (nextValue && !handlers.suggestions.value.some(item => item.id === nextValue)) {
      await fetchSuggestions()
    }
  }, { immediate: true })

  watch(battalionId, () => {
    void fetchSuggestions()
  })

  watchSuggestionsSearch(handlers.searchTerm, fetchSuggestions)

  return {
    ...handlers,
    suggestionOptions,
  }
}
