import { computed, ref, watch } from 'vue'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import {
  useSuggestionSelectionHandlers,
  watchSuggestionsSearch,
} from '~/handlers/personnel/suggestions.handler'
import type {
  EquipmentAssetSuggestionItem,
  EquipmentCategorySuggestionItem,
  EquipmentItemSuggestionItem,
} from '~/types/domain/equipment'
import {
  getEquipmentAssetSuggestionsEndpoint,
  getEquipmentCategorySuggestionsEndpoint,
  getEquipmentItemSuggestionsEndpoint,
} from '~/utils/equipment-endpoints'

export const useEquipmentCategorySuggestionsHandler = (modelValue: () => string | null) => {
  const handlers = useSuggestionSelectionHandlers<EquipmentCategorySuggestionItem>(
    (item) => `${item.code} - ${item.name}`,
  )
  const isLoading = ref(false)

  const suggestionOptions = computed<SuggestionFieldOption[]>(() => {
    return handlers.suggestions.value.map((item) => ({
      value: item.id,
      label: `${item.code} - ${item.name}`,
      description: `${item.isActive ? 'Active' : 'Inactive'} | Items: ${item.itemCount}`,
    }))
  })

  const fetchSuggestions = async () => {
    isLoading.value = true

    try {
      const response = await getEquipmentCategorySuggestionsEndpoint({
        term: handlers.searchTerm.value,
        pageSize: 10,
        selectedId: modelValue() ?? undefined,
      })
      handlers.suggestions.value = response.items
    } finally {
      isLoading.value = false
    }
  }

  watch(
    modelValue,
    async (nextValue) => {
      if (nextValue && !handlers.suggestions.value.some((item) => item.id === nextValue)) {
        await fetchSuggestions()
      }
    },
    { immediate: true },
  )

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

export const useEquipmentItemSuggestionsHandler = (modelValue: () => string | null) => {
  const handlers = useSuggestionSelectionHandlers<EquipmentItemSuggestionItem>(
    (item) => `${item.equipmentCode} - ${item.name}`,
  )
  const isLoading = ref(false)

  const suggestionOptions = computed<SuggestionFieldOption[]>(() => {
    return handlers.suggestions.value.map((item) => ({
      value: item.id,
      label: `${item.equipmentCode} - ${item.name}`,
      description: `Category: ${item.categoryName || 'Uncategorized'} | ${item.isActive ? 'Active' : 'Inactive'}`,
    }))
  })

  const fetchSuggestions = async () => {
    isLoading.value = true

    try {
      const response = await getEquipmentItemSuggestionsEndpoint({
        term: handlers.searchTerm.value,
        pageSize: 10,
        selectedId: modelValue() ?? undefined,
      })
      handlers.suggestions.value = response.items
    } finally {
      isLoading.value = false
    }
  }

  watch(
    modelValue,
    async (nextValue) => {
      if (nextValue && !handlers.suggestions.value.some((item) => item.id === nextValue)) {
        await fetchSuggestions()
      }
    },
    { immediate: true },
  )

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

export const useEquipmentAssetSuggestionsHandler = (modelValue: () => string | null) => {
  const handlers = useSuggestionSelectionHandlers<EquipmentAssetSuggestionItem>(
    (item) => `${item.assetTag} - ${item.equipmentItemName}`,
  )
  const isLoading = ref(false)

  const suggestionOptions = computed<SuggestionFieldOption[]>(() => {
    return handlers.suggestions.value.map((item) => ({
      value: item.id,
      label: `${item.assetTag} - ${item.equipmentItemName}`,
      description: `Category: ${item.categoryName || 'Uncategorized'}`,
    }))
  })

  const fetchSuggestions = async () => {
    isLoading.value = true

    try {
      const response = await getEquipmentAssetSuggestionsEndpoint({
        term: handlers.searchTerm.value,
        pageSize: 10,
        selectedId: modelValue() ?? undefined,
      })
      handlers.suggestions.value = response.items
    } finally {
      isLoading.value = false
    }
  }

  watch(
    modelValue,
    async (nextValue) => {
      if (nextValue && !handlers.suggestions.value.some((item) => item.id === nextValue)) {
        await fetchSuggestions()
      }
    },
    { immediate: true },
  )

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
