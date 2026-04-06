<template>
  <label class="flex items-start gap-3" :for="inputId">
    <input
      :id="inputId"
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      :class="CHECK_CONTROL_CLASSES"
      @change="onChange"
    />
    <span>
      <span class="text-sm font-medium text-slate-700">{{ label }}</span>
      <span v-if="description" class="block text-sm text-slate-500">{{ description }}</span>
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'
import { CHECK_CONTROL_CLASSES } from '../../constants/ui.constants'

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
