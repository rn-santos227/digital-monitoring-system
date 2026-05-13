import { computed, ref, watch } from 'vue'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import { useSuggestionSelectionHandlers, watchSuggestionsSearch } from '~/handlers/personnel/suggestions.handler'
import type { BattalionListItem } from '~/types/domain/units'
import { getBattalionSuggestionsEndpoint } from '~/utils/units-endpoints'

export const useBattalionSuggestionsHandler = (modelValue: () => string | null) => {
  const handlers = useSuggestionSelectionHandlers<BattalionListItem>((item) => `${item.code} • ${item.name}`)
  const isLoading = ref(false)

  const suggestionOptions = computed<SuggestionFieldOption[]>(() => {
    return handlers.suggestions.value.map((item) => ({
      value: item.id,
      label: `${item.code} • ${item.name}`,
      description: item.isActive ? 'Active battalion' : 'Inactive battalion',
    }))
  })

  const fetchSuggestions = async () => {
    isLoading.value = true
    try {
      const response = await getBattalionSuggestionsEndpoint({
        term: handlers.searchTerm.value,
        pageSize: 10,
        selectedId: modelValue() ?? undefined,
      })
      handlers.suggestions.value = response.items
    } finally {
      isLoading.value = false
    }
  }

  watch(modelValue, async (nextValue) => {
    if (nextValue && !handlers.suggestions.value.some(item => item.id === nextValue)) {
      await fetchSuggestions()
    }
  }, { immediate: true })

  watchSuggestionsSearch(handlers.searchTerm, async () => {
    if (handlers.suppressNextSearch.value) {
      handlers.suppressNextSearch.value = false
      return
    }
    await fetchSuggestions()
  })

  return {
    ...handlers,
    isLoading,
    suggestionOptions,
  }
}
