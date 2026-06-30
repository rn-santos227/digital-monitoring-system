<template>
  <div ref="fieldElement" class="relative w-full max-w-2xl">
    <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useRouter } from '#imports'
import { SEARCH_API_ENDPOINTS } from '~/constants/api.constants'
import { DASHBOARD_SEARCH_PLACEHOLDER } from '~/constants/navigation.constants'
import type { GlobalSearchSuggestionItem, GlobalSearchSuggestionResponse, GlobalSearchSuggestionDomain } from '~/types/domain/global-search'

const MINIMUM_SEARCH_LENGTH = 2
const SEARCH_DEBOUNCE_MS = 250

const props = withDefaults(
  defineProps<{
    modelValue?: string
    placeholder?: string
    id?: string
    helperText?: string
    error?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: DASHBOARD_SEARCH_PLACEHOLDER,
    id: undefined,
    helperText: '',
    error: '',
    disabled: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'search', value: string): void
}>()

const router = useRouter()
const fieldElement = ref<HTMLElement | null>(null)
const query = ref(props.modelValue)
const suggestionItems = ref<GlobalSearchSuggestionItem[]>([])
const isLoading = ref(false)
const isDropdownOpen = ref(false)
const hasSearched = ref(false)
const highlightedIndex = ref(0)
let debounceTimer: ReturnType<typeof setTimeout> | null = null
let activeRequestId = 0

const isDropdownVisible = computed(() => isDropdownOpen.value && !props.disabled && (isLoading.value || hasSearched.value || suggestionItems.value.length > 0))

const getDomainLabel = (domain: GlobalSearchSuggestionDomain) => {
  const labels: Record<GlobalSearchSuggestionDomain, string> = {
    personnel: 'Personnel',
    equipment: 'Equipment',
    incident: 'Incident',
  }

  return labels[domain] ?? 'Record'
}

const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const highlightMatch = (value: string) => {
  const safeValue = escapeHtml(value)
  const trimmedQuery = query.value.trim()

  if (!trimmedQuery) {
    return safeValue
  }

  return safeValue.replace(
    new RegExp(`(${escapeRegExp(escapeHtml(trimmedQuery))})`, 'ig'),
    '<mark class="rounded bg-amber-100 px-0.5 text-amber-900">$1</mark>',
  )
}

const clearPendingSearch = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
    debounceTimer = null
  }
}

const fetchSuggestions = async (term: string) => {
  const requestId = activeRequestId + 1
  activeRequestId = requestId
  isLoading.value = true
  hasSearched.value = false

  try {
    const response = await $fetch<GlobalSearchSuggestionResponse>(SEARCH_API_ENDPOINTS.suggestions, {
      query: { term },
    })

    if (requestId !== activeRequestId) {
      return
    }

    suggestionItems.value = response.items
    highlightedIndex.value = 0
  } catch {
    if (requestId === activeRequestId) {
      suggestionItems.value = []
    }
  } finally {
    if (requestId === activeRequestId) {
      isLoading.value = false
      hasSearched.value = true
    }
  }
}

const queueSuggestionsFetch = (value: string) => {
  clearPendingSearch()
  const term = value.trim()

  if (term.length < MINIMUM_SEARCH_LENGTH) {
    activeRequestId += 1
    suggestionItems.value = []
    hasSearched.value = false
    isLoading.value = false
    return
  }

  debounceTimer = setTimeout(() => fetchSuggestions(term), SEARCH_DEBOUNCE_MS)
}

const onQueryInput = () => {
  isDropdownOpen.value = true
  emit('update:modelValue', query.value)
  emit('search', query.value.trim())
  queueSuggestionsFetch(query.value)
}
</script>
