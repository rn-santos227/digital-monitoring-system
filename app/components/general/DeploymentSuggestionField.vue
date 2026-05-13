<template>
  <BaseSuggestionField
    :model-value="modelValue"
    :options="suggestionOptions"
    @query-change="onQueryChange"
    :label="label"
    :placeholder="placeholder"
    :helper-text="helperText"
    :empty-message="emptyMessage"
    :is-loading="isLoading"
    :error="error"
    :disabled="disabled"
    @update:model-value="onModelValueUpdate"
  />
</template>

<script setup lang="ts">
import { useDeploymentSuggestionsHandler } from '~/handlers'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'

const props = withDefaults(defineProps<{
  modelValue: string | null
  label?: string
  placeholder?: string
  helperText?: string
  emptyMessage?: string
  error?: string
  disabled?: boolean
}>(), {
  label: 'Deployment',
  placeholder: 'Search deployment operation',
  helperText: 'Select a deployment profile for operational assignment.',
  emptyMessage: 'No deployment profiles found.',
  error: '',
  disabled: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
  (event: 'select', payload: DeploymentManagementListItem | null): void
}>()

const { suggestionOptions, isLoading, onModelValueUpdate: mapNextValue, onQueryChange, emitSelectedItem } = useDeploymentSuggestionsHandler(() => props.modelValue)

const onModelValueUpdate = (value: string | string[] | null) => {
  if (Array.isArray(value)) {
    return
  }

  const nextValue = mapNextValue(value)
  emit('update:modelValue', nextValue)
  emit('select', emitSelectedItem(nextValue))
}
</script>
