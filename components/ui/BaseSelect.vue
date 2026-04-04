<template>
  <div class="space-y-1">
    <label v-if="label" :for="inputId" class="text-sm font-medium text-slate-700">
      {{ label }}
      <span v-if="required" class="text-rose-600">*</span>
    </label>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

type SelectOption = {
  label: string
  value: string
}

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

const baseClasses =
  'w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2'

const onChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  emit('update:modelValue', target.value)
}
</script>