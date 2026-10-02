<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" :class="FIELD_LABEL_CLASSES">
      {{ label }}
      <span v-if="required" :class="FIELD_REQUIRED_MARKER_CLASSES">*</span>
    </label>
    <div class="relative">
      <input
        :id="inputId"
        :type="resolvedType"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :min="min"
        :max="max"
        :class="inputClasses"
        @input="onInput"
      />
      <button
        v-if="isPassword"
        type="button"
        class="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full p-1 text-slate-500 transition hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        :disabled="disabled"
        @click="togglePassword"
      >
        <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="h-5 w-5" aria-hidden="true" />
        <span class="sr-only">{{ showPassword ? 'Hide password' : 'Show password' }}</span>
      </button>
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
import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/24/outline'
import { computed, ref, useId } from 'vue'
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
    modelValue?: string | number
    label?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url' | 'date'
    placeholder?: string
    helperText?: string
    error?: string
    id?: string
    required?: boolean
    disabled?: boolean
    min?: number
    max?: number
  }>(),
  {
    modelValue: '',
    type: 'text',
    placeholder: '',
    helperText: '',
    error: '',
    required: false,
    disabled: false,
    min: undefined,
    max: undefined
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `text-field-${generatedId}`)
const showPassword = ref(false)
const isPassword = computed(() => props.type === 'password')
const resolvedType = computed(() => (isPassword.value && showPassword.value ? 'text' : props.type))

const inputClasses = computed(() => [
  FORM_CONTROL_BASE_CLASSES,
  isPassword.value ? 'pr-14' : '',
  props.error ? FORM_CONTROL_STATE_CLASSES.error : FORM_CONTROL_STATE_CLASSES.default,
  props.disabled ? FORM_CONTROL_STATE_CLASSES.disabled : FORM_CONTROL_STATE_CLASSES.enabled
])

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const togglePassword = () => {
  if (props.disabled) return
  showPassword.value = !showPassword.value
}
</script>
