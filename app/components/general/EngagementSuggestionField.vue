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
import { useEngagementSuggestionsHandler } from '~/handlers/engagements/suggestions.handler'
import type { EngagementManagementListItem } from '~/types/domain/engagement'

const props = withDefaults(defineProps<{
  modelValue: string | null
  label?: string
  placeholder?: string
  helperText?: string
  emptyMessage?: string
  error?: string
  disabled?: boolean
}>(), {
  label: 'Engagement',
  placeholder: 'Search engagement profile',
  helperText: 'Select an engagement profile for operations tracking.',
  emptyMessage: 'No engagement profiles found.',
  error: '',
  disabled: false,
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
  (event: 'select', payload: EngagementManagementListItem | null): void
}>()

const { suggestionOptions, isLoading, onModelValueUpdate: mapNextValue, onQueryChange, emitSelectedItem } = useEngagementSuggestionsHandler(() => props.modelValue)

const onModelValueUpdate = (value: string | string[] | null) => {
  if (Array.isArray(value)) {
    return
  }

  const nextValue = mapNextValue(value)
  emit('update:modelValue', nextValue)
  emit('select', emitSelectedItem(nextValue))
}
</script>
