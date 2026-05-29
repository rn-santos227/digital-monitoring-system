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
import { useEquipmentAssetSuggestionsHandler } from '~/handlers'
import type { EquipmentAssetSuggestionItem } from '~/types/domain/equipment'

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
    label: 'Equipment asset',
    placeholder: 'Search equipment asset tag',
    helperText: 'Select an equipment asset from the registry.',
    emptyMessage: 'No equipment assets found.',
    error: '',
    disabled: false,
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
  (event: 'select', payload: EquipmentAssetSuggestionItem | null): void
}>()

const { suggestionOptions, isLoading, onModelValueUpdate: mapNextValue, onQueryChange, emitSelectedItem } = useEquipmentAssetSuggestionsHandler(
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
