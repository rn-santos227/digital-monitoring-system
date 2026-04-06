<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" :class="FIELD_LABEL_CLASSES">
      {{ label }}
      <span v-if="required" :class="FIELD_REQUIRED_MARKER_CLASSES">*</span>
    </label>
    <input
      :id="inputId"
      type="date"
      :value="modelValue"
      :min="min"
      :max="max"
      :disabled="disabled"
      :class="datePickerClasses"
      @input="onInput"
    />
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

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    helperText?: string
    error?: string
    id?: string
    min?: string
    max?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: '',
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
const inputId = computed(() => props.id ?? `date-picker-${generatedId}`)

const datePickerClasses = computed(() => [
  FORM_CONTROL_BASE_CLASSES,
  props.error ? FORM_CONTROL_STATE_CLASSES.error : FORM_CONTROL_STATE_CLASSES.default,
  props.disabled ? FORM_CONTROL_STATE_CLASSES.disabled : FORM_CONTROL_STATE_CLASSES.enabled
])

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
