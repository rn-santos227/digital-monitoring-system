import { computed, ref, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import type { PersonnelSuggestion } from '~/types/domain/personnel'
import { getPersonnelSuggestionsEndpoint } from '~/utils/personnel-endpoints'

interface SuggestionSelectionHandlers<TItem extends { id: string }> {
  suggestions: Ref<TItem[]>
  searchTerm: Ref<string>
  suppressNextSearch: Ref<boolean>
  onModelValueUpdate: (value: string | string[] | null) => string | null
  onQueryChange: (value: string) => void
  emitSelectedItem: (value: string | null) => TItem | null
}

const useSuggestionSelectionHandlers = <TItem extends { id: string }>(
  updateSearchTermFromSelection: (item: TItem) => string
): SuggestionSelectionHandlers<TItem> => {
  const suggestions = shallowRef<TItem[]>([])
  const searchTerm = ref('')
  const suppressNextSearch = ref(false)

  const onModelValueUpdate = (value: string | string[] | null): string | null => {
    if (Array.isArray(value)) {
      return null
    }

    return value && value.length > 0 ? value : null
  }

  const emitSelectedItem = (value: string | null): TItem | null => {
    const selectedItem = suggestions.value.find((item) => item.id === value) ?? null

    if (!selectedItem) {
      searchTerm.value = ''
      return null
    }

    suppressNextSearch.value = true
    searchTerm.value = updateSearchTermFromSelection(selectedItem)
    return selectedItem
  }

  const onQueryChange = (value: string) => {
    searchTerm.value = value
  }

  return {
    suggestions,
    searchTerm,
    suppressNextSearch,
    onModelValueUpdate,
    onQueryChange,
    emitSelectedItem,
  }
}

const watchSuggestionsSearch = (
  searchTerm: Ref<string>,
  fetchSuggestions: () => Promise<void>
) => {
  let searchTimeout: ReturnType<typeof setTimeout> | null = null

  watch(searchTerm, () => {
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    searchTimeout = setTimeout(() => {
      void fetchSuggestions()
    }, 250)
  })
}

export const usePersonnelSuggestionsHandler = (
  selectedPersonnelId: () => string | null | undefined,
  modelValue: () => string | null
) => {
  const handlers = useSuggestionSelectionHandlers<PersonnelSuggestion>((item) => item.fullName)
  const isLoading = ref(false)

  const suggestionOptions = computed<SuggestionFieldOption[]>(() => {
    return handlers.suggestions.value.map((item) => ({
      value: item.id,
      label: `${item.fullName} (${item.personnelCode})`,
      description: `${item.rankName} • ${item.serviceNumber}`,
    }))
  })

  const fetchSuggestions = async () => {
    isLoading.value = true

    try {
      const response = await getPersonnelSuggestionsEndpoint({
        term: handlers.searchTerm.value,
        pageSize: 10,
        selectedPersonnelId: selectedPersonnelId() ?? undefined,
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

export { useSuggestionSelectionHandlers, watchSuggestionsSearch }
