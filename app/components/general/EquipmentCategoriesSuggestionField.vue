<template>

</template>

<script setup lang="ts">
import { useEquipmentCategorySuggestionsHandler } from '~/handlers'
import type { EquipmentCategorySuggestionItem } from '~/types/domain/equipment'

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
    label: 'Equipment category',
    placeholder: 'Search equipment category code or name',
    helperText: 'Select an equipment category from the registry.',
    emptyMessage: 'No equipment categories found.',
    error: '',
    disabled: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
  (event: 'select', payload: EquipmentCategorySuggestionItem | null): void
}>()

</script>
