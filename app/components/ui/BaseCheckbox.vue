<template>
  <label :class="labelClasses" :for="inputId">
    <input
      ref="inputElement"
      :id="inputId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :class="inputClasses"
      @change="onChange"
    />
    <span :class="visuallyHiddenLabel ? 'sr-only' : 'flex-1'">
      <span class="text-sm font-medium text-slate-700">{{ label }}</span>
      <span v-if="description" class="block text-sm text-slate-500">{{ description }}</span>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, useId, useTemplateRef, watchEffect } from 'vue'
import { CHECK_CONTROL_CLASSES } from '../../constants/ui.constants'

const props = withDefaults(
  defineProps<{
    modelValue?: boolean
    label: string
    description?: string
    id?: string
    disabled?: boolean
    indeterminate?: boolean
    visuallyHiddenLabel?: boolean
  }>(),
  {
    modelValue: false,
    description: '',
    disabled: false,
    indeterminate: false,
    visuallyHiddenLabel: false,
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const generatedId = useId()
const inputElement = useTemplateRef<HTMLInputElement>('inputElement')
const inputId = computed(() => props.id ?? `checkbox-${generatedId}`)
const labelClasses = computed(() => {
  return props.description ? 'flex items-start gap-3' : 'flex items-center gap-3'
})
const inputClasses = computed(() => {
  return props.description ? `${CHECK_CONTROL_CLASSES} mt-1 shrink-0` : `${CHECK_CONTROL_CLASSES} shrink-0`
})

watchEffect(() => {
  if (inputElement.value) {
    inputElement.value.indeterminate = props.indeterminate
  }
})

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
