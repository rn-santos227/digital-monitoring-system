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
</script>
