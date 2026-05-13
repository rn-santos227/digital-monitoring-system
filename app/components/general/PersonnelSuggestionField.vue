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
import {
  USERS_PROFILE_PERSONNEL_EMPTY_MESSAGE,
  USERS_PROFILE_PERSONNEL_HELPER_TEXT,
  USERS_PROFILE_PERSONNEL_LABEL,
  USERS_PROFILE_PERSONNEL_PLACEHOLDER,
} from '~/constants/page.constants'
import { usePersonnelSuggestionsHandler } from '~/handlers'
import type { PersonnelSuggestion } from '~/types/domain/personnel'

const props = withDefaults(
  defineProps<{
    modelValue: string | null
    selectedPersonnelId?: string | null
    label?: string
    placeholder?: string
    helperText?: string
    emptyMessage?: string
    error?: string
    disabled?: boolean
  }>(),
  {
    selectedPersonnelId: null,
    label: USERS_PROFILE_PERSONNEL_LABEL,
    placeholder: USERS_PROFILE_PERSONNEL_PLACEHOLDER,
    helperText: USERS_PROFILE_PERSONNEL_HELPER_TEXT,
    emptyMessage: USERS_PROFILE_PERSONNEL_EMPTY_MESSAGE,
    error: '',
    disabled: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | null): void
  (event: 'select', payload: PersonnelSuggestion | null): void
}>()

const { suggestionOptions, isLoading, onModelValueUpdate: mapNextValue, onQueryChange, emitSelectedItem } = usePersonnelSuggestionsHandler(
  () => props.selectedPersonnelId,
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
