<template>

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


</script>
