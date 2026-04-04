<template>
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
</script>