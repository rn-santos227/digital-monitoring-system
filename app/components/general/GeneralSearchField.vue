<template>
  <div class="relative w-full max-w-2xl">
    <MagnifyingGlassIcon class="pointer-events-none absolute left-3 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
    <BaseSuggestionField
      :model-value="modelValue"
      :options="suggestions"
      :placeholder="placeholder"
      :id="id"
      :disabled="disabled"
      :helper-text="helperText"
      :error="error"
      class="general-search-field"
      @update:model-value="onSelectionChange"
      @query-change="onQueryChange"
    />
  </div>
</template>

<script setup lang="ts">
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { DASHBOARD_SEARCH_PLACEHOLDER } from '~/constants/navigation.constants'
import type { SuggestionFieldOption } from '~/constants/ui.constants'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    suggestions?: readonly SuggestionFieldOption[]
    placeholder?: string
    id?: string
    helperText?: string
    error?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    suggestions: () => [],
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

const onSelectionChange = (value: string | string[] | null) => {
  const normalizedValue = typeof value === 'string' ? value : ''
  emit('update:modelValue', normalizedValue)
  emit('search', normalizedValue.trim())
}

const onQueryChange = (value: string) => {
  emit('search', value.trim())
}
</script>

<style scoped>
:deep(.general-search-field input) {
  padding-left: 2.5rem;
}
</style>
