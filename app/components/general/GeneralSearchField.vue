<template>

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

}
</script>

<style scoped>
:deep(.general-search-field input) {
  padding-left: 2.5rem;
}
</style>
