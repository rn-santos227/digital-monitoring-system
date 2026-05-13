import { computed, ref, watch } from 'vue'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import { useSuggestionSelectionHandlers, watchSuggestionsSearch } from '~/handlers/personnel/suggestions.handler'
import type { TrainingSuggestionItem } from '~/types/domain/training'
import { getTrainingSuggestionsEndpoint } from '~/utils/training-endpoints'

export const useTrainingSuggestionsHandler = (modelValue: () => string | null) => {
  const handlers = useSuggestionSelectionHandlers<TrainingSuggestionItem>((item) => item.trainingTitle)
  const isLoading = ref(false)

  const suggestionOptions = computed<SuggestionFieldOption[]>(() => {
    return handlers.suggestions.value.map((item) => ({
      value: item.id,
      label: item.trainingTitle,
      description: [
        item.trainingCategoryName ?? 'No category',
        item.levelName ?? 'No level',
        item.statusName ?? 'No status',
      ].join(' • '),
    }))
  })

  const fetchSuggestions = async () => {
    isLoading.value = true
    try {
      const response = await getTrainingSuggestionsEndpoint({
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
