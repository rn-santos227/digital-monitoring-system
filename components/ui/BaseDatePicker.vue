<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-rose-600">*</span>
    </label>
    <input
      :id="inputId"
      type="date"
      :value="modelValue"
      :min="min"
      :max="max"
      :disabled="disabled"
      :class="[
        baseClasses,
        error ? 'border-rose-500 focus-visible:ring-rose-500' : 'border-slate-300 focus-visible:ring-indigo-500 focus-visible:border-indigo-500',
        disabled ? 'bg-slate-100 text-slate-400' : 'bg-slate-50'
      ]"
      @input="onInput"
    />
    <p v-if="error" class="text-sm text-rose-600">
      {{ error }}
    </p>
    <p v-else-if="helperText" class="text-sm text-slate-500">
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

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

const baseClasses =
  'w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2'

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
