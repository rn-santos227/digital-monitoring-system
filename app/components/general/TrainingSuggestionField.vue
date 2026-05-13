<template>
  <BaseSuggestionField
    :model-value="modelValue"
    :options="suggestionOptions"
    :label="label"
    :placeholder="placeholder"
    :helper-text="helperText"
    :empty-message="emptyMessage"
    :is-loading="isLoading"
    :error="error"
    :disabled="disabled"
    @update:model-value="onModelValueUpdate"
    @query-change="onQueryChange"
  />
</template>

<script setup lang="ts">
import { useTrainingSuggestionsHandler } from '~/handlers'
import type { TrainingSuggestionItem } from '~/types/domain/training'

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
    label: 'Training',
    placeholder: 'Search training title',
    helperText: 'Select a training from the registry.',
    emptyMessage: 'No training records found.',
    error: '',
    disabled: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
  (event: 'select', payload: TrainingSuggestionItem | null): void
}>()

const { suggestionOptions, isLoading, onModelValueUpdate: mapNextValue, onQueryChange, emitSelectedItem } = useTrainingSuggestionsHandler(
  () => props.modelValue
)

const onModelValueUpdate = (value: string | string[] | null) => {
  if (Array.isArray(value)) {
    return
  }

  const nextValue = mapNextValue(value)
  emit('update:modelValue', nextValue)
  emit('select', emitSelectedItem(nextValue))
}
</script>
