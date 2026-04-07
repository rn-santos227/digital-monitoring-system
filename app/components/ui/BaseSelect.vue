<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" :class="FIELD_LABEL_CLASSES">
      {{ label }}
      <span v-if="required" :class="FIELD_REQUIRED_MARKER_CLASSES">*</span>
    </label>
    <select
      :id="inputId"
      :value="modelValue"
      :disabled="disabled"
      :class="selectClasses"
      @change="onChange"
    >
      <option v-if="placeholder" disabled value="">
        {{ placeholder }}
      </option>
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <p v-if="error" :class="FIELD_ERROR_TEXT_CLASSES">
      {{ error }}
    </p>
    <p v-else-if="helperText" :class="FIELD_HELPER_TEXT_CLASSES">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import {
  FIELD_ERROR_TEXT_CLASSES,
  FIELD_HELPER_TEXT_CLASSES,
  FIELD_LABEL_CLASSES,
  FIELD_REQUIRED_MARKER_CLASSES,
  FORM_CONTROL_BASE_CLASSES,
  FORM_CONTROL_STATE_CLASSES
} from '../../constants/ui.constants'
import type { SelectOption } from '../../types/domain/misc'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    helperText?: string
    error?: string
    id?: string
    options: SelectOption[]
    required?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    label: '',
    placeholder: '',
    helperText: '',
    error: '',
    required: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `select-${generatedId}`)

const selectClasses = computed(() => [
  FORM_CONTROL_BASE_CLASSES,
  props.error ? FORM_CONTROL_STATE_CLASSES.error : FORM_CONTROL_STATE_CLASSES.default,
  props.disabled ? FORM_CONTROL_STATE_CLASSES.disabled : FORM_CONTROL_STATE_CLASSES.enabled
])

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>
