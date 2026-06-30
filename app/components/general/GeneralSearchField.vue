<template>
  <div ref="fieldElement" class="relative w-full max-w-2xl">
    <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
    <input
      :id="id"
      v-model="query"
      type="search"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-expanded="isDropdownVisible"
      aria-autocomplete="list"
      class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-10 text-sm text-slate-700 shadow-sm transition placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
      @focus="isDropdownOpen = true"
      @input="onQueryInput"
      @keydown.down.prevent="moveHighlightedSuggestion(1)"
      @keydown.up.prevent="moveHighlightedSuggestion(-1)"
      @keydown.enter.prevent="selectHighlightedSuggestion"
      @keydown.esc="isDropdownOpen = false"
    />

    <div
      v-if="isDropdownVisible"
      class="absolute left-0 right-0 top-full z-40 mt-2 max-h-96 overflow-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
      role="listbox"
    >
      <p v-if="isLoading" class="px-3 py-3 text-sm text-slate-500">
        <span class="inline-flex items-center gap-2">
          <span class="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
          <span>Loading search suggestions...</span>
        </span>
      </p>

      <template v-else-if="suggestionItems.length > 0">
        <button
          v-for="(suggestion, index) in suggestionItems"
          :key="`${suggestion.domain}-${suggestion.id}`"
          type="button"
          role="option"
          :aria-selected="highlightedIndex === index"
          :class="[
            'flex w-full gap-3 rounded-xl px-3 py-3 text-left transition',
            highlightedIndex === index ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700 hover:bg-slate-50',
          ]"
          @mouseenter="highlightedIndex = index"
          @mousedown.prevent
          @click="selectSuggestion(suggestion)"
        >

        </button>
      </template>
    </div>
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

const moveHighlightedSuggestion = (step: number) => {
  if (suggestionItems.value.length === 0) {
    return
  }

  const nextIndex = highlightedIndex.value + step
  highlightedIndex.value = (nextIndex + suggestionItems.value.length) % suggestionItems.value.length
}

const selectSuggestion = async (suggestion: GlobalSearchSuggestionItem) => {
  query.value = suggestion.title
  emit('update:modelValue', suggestion.title)
  emit('search', suggestion.title)
  isDropdownOpen.value = false
  await router.push(suggestion.redirectTo)
}

const selectHighlightedSuggestion = async () => {
  const suggestion = suggestionItems.value[highlightedIndex.value]

  if (suggestion) {
    await selectSuggestion(suggestion)
  }
}

const onDocumentPointerDown = (event: PointerEvent) => {
  if (!fieldElement.value?.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

watch(
  () => props.modelValue,
  (value) => {
    if (value !== query.value) {
      query.value = value
    }
  }
)

onMounted(() => document.addEventListener('pointerdown', onDocumentPointerDown))
onBeforeUnmount(() => {
  clearPendingSearch()
  document.removeEventListener('pointerdown', onDocumentPointerDown)
})
</script>
