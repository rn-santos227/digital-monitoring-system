<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" :class="FIELD_LABEL_CLASSES">
      {{ label }}
      <span v-if="required" :class="FIELD_REQUIRED_MARKER_CLASSES">*</span>
    </label>

    <input
      :id="inputId"
      type="file"
      :accept="accept"
      :disabled="disabled"
      :class="inputClasses"
      @change="onChange"
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
  FORM_CONTROL_STATE_CLASSES,
} from '~/constants/ui.constants'

const props = withDefaults(
  defineProps<{
    label?: string
    id?: string
    accept?: string
    helperText?: string
    error?: string
    required?: boolean
    disabled?: boolean
  }>(),
  {
    label: '',
    id: undefined,
    accept: '*',
    helperText: '',
    error: '',
    required: false,
    disabled: false,
  },
)

const emit = defineEmits<{
  (event: 'update:file', value: File | null): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `file-upload-${generatedId}`)

const inputClasses = computed(() => [
  FORM_CONTROL_BASE_CLASSES,
  props.error ? FORM_CONTROL_STATE_CLASSES.error : FORM_CONTROL_STATE_CLASSES.default,
  props.disabled ? FORM_CONTROL_STATE_CLASSES.disabled : FORM_CONTROL_STATE_CLASSES.enabled,
  'file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-900',
])

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:file', target.files?.[0] ?? null)
}
</script>
