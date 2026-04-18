<template>

</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue'
import type { SuggestionFieldOption } from '~/constants/ui.constants'
import {
  FIELD_ERROR_TEXT_CLASSES,
  FIELD_HELPER_TEXT_CLASSES,
  FIELD_LABEL_CLASSES,
  FIELD_REQUIRED_MARKER_CLASSES,
  FORM_CONTROL_BASE_CLASSES,
  FORM_CONTROL_STATE_CLASSES,
  SUGGESTION_FIELD_CONTAINER_CLASSES,
  SUGGESTION_FIELD_EMPTY_CLASSES,
  SUGGESTION_FIELD_ITEM_ACTIVE_CLASSES,
  SUGGESTION_FIELD_ITEM_CLASSES,
  SUGGESTION_FIELD_PANEL_CLASSES,
} from '~/constants/ui.constants'

type SuggestionValue = string | string[] | null

const props = withDefaults(
  defineProps<{
    modelValue?: SuggestionValue
    options: readonly SuggestionFieldOption[]
    label?: string
    placeholder?: string
    helperText?: string
    error?: string
    emptyMessage?: string
    required?: boolean
    disabled?: boolean
    multiple?: boolean
    id?: string
  }>(),
  {
    modelValue: null,
    label: '',
    placeholder: 'Type to search options',
    helperText: '',
    error: '',
    emptyMessage: 'No options found.',
    required: false,
    disabled: false,
    multiple: false,
    id: undefined,
  }
)
</script>
