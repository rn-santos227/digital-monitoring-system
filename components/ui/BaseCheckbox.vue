<template>
  <label class="flex items-start gap-3">
    <input
      :id="inputId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="mt-1 h-4 w-4 rounded border-slate-300 text-indigo-600 focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
      @change="onChange"
    />
  </label>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label: string
    description?: string
    id?: string
    disabled?: boolean
  }>(),
  {
    modelValue: false,
    description: '',
    disabled: false
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const generatedId = useId()
const inputId = computed(() => props.id ?? `checkbox-${generatedId}`)

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
