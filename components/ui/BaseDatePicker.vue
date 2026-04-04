<template>

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

</script>
