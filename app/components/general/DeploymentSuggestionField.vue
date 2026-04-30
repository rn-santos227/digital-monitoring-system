<template>
  <BaseSuggestionField
    :model-value="modelValue"
    :options="options"
    :label="label"
    :placeholder="placeholder"
    :helper-text="helperText"
    :empty-message="emptyMessage"
    :error="error"
    :disabled="disabled"
    @update:model-value="onModelValueUpdate"
  />
</template>

<script setup lang="ts">
import type { SuggestionFieldOption } from '~/constants/ui.constants'

const props = withDefaults(defineProps<{
  modelValue: string | null
  options: SuggestionFieldOption[]
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
}>()

const onModelValueUpdate = (value: string | string[] | null) => {
  if (Array.isArray(value)) {
    return
  }

  emit('update:modelValue', value)
}
</script>
