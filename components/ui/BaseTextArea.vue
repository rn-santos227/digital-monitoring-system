<template>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    placeholder?: string
    helperText?: string
    error?: string
    id?: string
    rows?: number
    required?: boolean
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    placeholder: '',
    helperText: '',
    error: '',
    rows: 4,
    required: false,
    disabled: false
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `text-area-${generatedId}`)

const baseClasses =
  'w-full rounded-xl border px-3 py-2.5 text-sm text-slate-900 shadow-sm transition focus-visible:outline-none focus-visible:ring-2'

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
