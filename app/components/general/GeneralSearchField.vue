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
</script>

<style scoped>
:deep(.general-search-field input) {
  padding-left: 2.5rem;
}
</style>
