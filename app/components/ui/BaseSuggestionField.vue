<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" :class="FIELD_LABEL_CLASSES">
      {{ label }}
      <span v-if="required" :class="FIELD_REQUIRED_MARKER_CLASSES">*</span>
    </label>

    <div :class="SUGGESTION_FIELD_CONTAINER_CLASSES">
      <input
        :id="inputId"
        v-model="query"
        type="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        @focus="isPanelOpen = true"
        @blur="onBlur"
        @input="onInput"
      />

      <div v-if="isPanelVisible" :class="panelClasses">
        <button
          v-for="option in filteredOptions"
          :key="option.value"
          type="button"
          :class="[SUGGESTION_FIELD_ITEM_CLASSES, isSelected(option.value) ? SUGGESTION_FIELD_ITEM_ACTIVE_CLASSES : '']"
          @mousedown.prevent
          @click="onSelect(option.value)"
        >
          <span class="block font-medium">{{ option.label }}</span>
          <span v-if="option.description" class="block text-xs text-slate-500">{{ option.description }}</span>
        </button>

        <p v-if="filteredOptions.length === 0" :class="SUGGESTION_FIELD_EMPTY_CLASSES">
          {{ emptyMessage }}
        </p>
      </div>
    </div>

    <p v-if="error" :class="FIELD_ERROR_TEXT_CLASSES">
      {{ error }}
    </p>
    <p v-else-if="helperText" :class="FIELD_HELPER_TEXT_CLASSES">
      {{ helperText }}
    </p>
  </div>
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
  SUGGESTION_FIELD_PANEL_POSITION_CLASSES,
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
    panelPosition?: 'top' | 'bottom'
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
    panelPosition: 'bottom',
    id: undefined,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: SuggestionValue): void
  (event: 'query-change', value: string): void
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


const isPanelVisible = computed(() => isPanelOpen.value && !props.disabled)

const inputClasses = computed(() => [
  FORM_CONTROL_BASE_CLASSES,
  props.error ? FORM_CONTROL_STATE_CLASSES.error : FORM_CONTROL_STATE_CLASSES.default,
  props.disabled ? FORM_CONTROL_STATE_CLASSES.disabled : FORM_CONTROL_STATE_CLASSES.enabled,
])

const panelClasses = computed(() => [
  SUGGESTION_FIELD_PANEL_CLASSES,
  SUGGESTION_FIELD_PANEL_POSITION_CLASSES[props.panelPosition],
])

const isSelected = (value: string) => selectedValues.value.includes(value)

const onSelect = (value: string) => {
  if (props.disabled) {
    return
  }

  if (props.multiple) {
    if (isSelected(value)) {
      emit('update:modelValue', selectedValues.value.filter((item) => item !== value))
    } else {
      emit('update:modelValue', [...selectedValues.value, value])
    }
    query.value = ''
    return
  }

  emit('update:modelValue', value)
  const selectedOption = props.options.find((option) => option.value === value)
  query.value = selectedOption?.label ?? ''
  isPanelOpen.value = false
}

const onBlur = () => {
  setTimeout(() => {
    isPanelOpen.value = false
  }, 100)
}

const onInput = () => {
  emit('query-change', query.value)
}
</script>
