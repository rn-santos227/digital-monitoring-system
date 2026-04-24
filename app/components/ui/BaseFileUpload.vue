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
import { computed, ref, useId } from 'vue'
import {
  FIELD_ERROR_TEXT_CLASSES,
  FIELD_HELPER_TEXT_CLASSES,
  FIELD_LABEL_CLASSES,
  FIELD_REQUIRED_MARKER_CLASSES,
  FORM_CONTROL_BASE_CLASSES,
  FORM_CONTROL_STATE_CLASSES,
} from '~/constants/ui.constants'
import { formatFileSizeLabel, isFileMimeTypeAllowed } from '~/utils/file-upload'

const props = withDefaults(
  defineProps<{
    label?: string
    id?: string
    accept?: string
    helperText?: string
    error?: string
    required?: boolean
    disabled?: boolean
    maxSizeBytes?: number | null
    allowedMimePrefixes?: string[]
  }>(),
  {
    label: '',
    id: undefined,
    accept: '*',
    helperText: '',
    error: '',
    required: false,
    disabled: false,
    maxSizeBytes: null,
    allowedMimePrefixes: () => [],
  },
)

const emit = defineEmits<{
  (event: 'update:file', value: File | null): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `file-upload-${generatedId}`)
const internalError = ref('')

const inputClasses = computed(() => [
  FORM_CONTROL_BASE_CLASSES,
  props.error ? FORM_CONTROL_STATE_CLASSES.error : FORM_CONTROL_STATE_CLASSES.default,
  props.disabled ? FORM_CONTROL_STATE_CLASSES.disabled : FORM_CONTROL_STATE_CLASSES.enabled,
  'file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-emerald-900',
])

const resolvedError = computed(() => props.error || internalError.value)
const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const selectedFile = target.files?.[0] ?? null
  internalError.value = ''

  if (!selectedFile) {
    emit('update:file', null)
    return
  }

  if (!isFileMimeTypeAllowed(selectedFile, props.allowedMimePrefixes)) {
    internalError.value = 'Selected file type is not allowed.'
    target.value = ''
    emit('update:file', null)
    return
  }

  if ((props.maxSizeBytes ?? 0) > 0 && selectedFile.size > (props.maxSizeBytes ?? 0)) {
    internalError.value = `Selected file exceeds the ${formatFileSizeLabel(props.maxSizeBytes ?? 0)} size limit.`
    target.value = ''
    emit('update:file', null)
    return
  }

  emit('update:file', selectedFile)
}
</script>
