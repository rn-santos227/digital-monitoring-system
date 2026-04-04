<template>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue'

type RadioOption = {
  label: string
  value: string
  helper?: string
}

const props = withDefaults(
  defineProps<{
    modelValue?: string
    label?: string
    options: RadioOption[]
    name?: string
    helperText?: string
    error?: string
    id?: string
    disabled?: boolean
  }>(),
  {
    modelValue: '',
    label: '',
    name: 'radio-group',
    helperText: '',
    error: '',
    disabled: false
  }
)
</script>
