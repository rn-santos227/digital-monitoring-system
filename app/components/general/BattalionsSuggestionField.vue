<template>
  <BaseSuggestionField
    :model-value="modelValue"
    :options="suggestionOptions"
    :label="label"
    :placeholder="placeholder"
    :helper-text="helperText"
    :empty-message="emptyMessage"
    :error="error"
    :disabled="disabled"
    @update:model-value="onModelValueUpdate"
    @query-change="onQueryChange"
  />
</template>

<script setup lang="ts">
import type { BattalionListItem } from '~/types/domain/units'
import { useBattalionSuggestionsHandler } from '~/handlers'

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    label?: string
    placeholder?: string
    helperText?: string
    emptyMessage?: string
    error?: string
    disabled?: boolean
  }>(),
  {
    label: 'Battalion',
    placeholder: 'Search battalion by code or name',
    helperText: 'Select a battalion assignment for this personnel record.',
    emptyMessage: 'No battalion records found.',
    error: '',
    disabled: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
  (event: 'select', payload: BattalionListItem | null): void
}>()

const { suggestionOptions, onModelValueUpdate: mapNextValue, onQueryChange, emitSelectedItem } = useBattalionSuggestionsHandler(() => props.modelValue)

const onModelValueUpdate = (value: string | string[] | null) => {
  if (Array.isArray(value)) {
    return
  }

  const nextValue = mapNextValue(value)
  emit('update:modelValue', nextValue)
  emit('select', emitSelectedItem(nextValue))
}
</script>
