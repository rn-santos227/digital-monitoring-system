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
import type { CompanyListItem } from '~/types/domain/units'
import { useCompanySuggestionsHandler } from '~/handlers'

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    battalionId?: string | null
    label?: string
    placeholder?: string
    helperText?: string
    emptyMessage?: string
    error?: string
    disabled?: boolean
  }>(),
  {
    battalionId: null,
    label: 'Company',
    placeholder: 'Search company by code or name',
    helperText: 'Select a company assignment for this personnel record.',
    emptyMessage: 'No company records found.',
    error: '',
    disabled: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
  (event: 'select', payload: CompanyListItem | null): void
}>()

const { suggestionOptions, onModelValueUpdate: mapNextValue, onQueryChange, emitSelectedItem } = useCompanySuggestionsHandler(
  () => props.battalionId,
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

