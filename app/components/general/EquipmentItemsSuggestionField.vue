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
import { useEquipmentItemSuggestionsHandler } from '~/handlers'
import type { EquipmentItemSuggestionItem } from '~/types/domain/equipment'

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
    label: 'Equipment item',
    placeholder: 'Search equipment item code or name',
    helperText: 'Select an equipment item from the registry.',
    emptyMessage: 'No equipment items found.',
    error: '',
    disabled: false,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
  (event: 'select', payload: EquipmentItemSuggestionItem | null): void
}>()

const { suggestionOptions, isLoading, onModelValueUpdate: mapNextValue, onQueryChange, emitSelectedItem } = useEquipmentItemSuggestionsHandler(
  () => props.modelValue,
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
