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

const emit = defineEmits<{
  (event: 'update:modelValue', value: SuggestionValue): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `suggestion-field-${generatedId}`)
const query = ref('')
const isPanelOpen = ref(false)

const selectedValues = computed(() => {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue
  }

  if (typeof props.modelValue === 'string' && props.modelValue.length > 0) {
    return [props.modelValue]
  }

  return []
})

const filteredOptions = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase()

  if (!normalizedQuery) {
    return props.options
  }

  return props.options.filter((option) => {
    const text = `${option.label} ${option.description ?? ''}`.toLowerCase()
    return text.includes(normalizedQuery)
  })
})

</script>
