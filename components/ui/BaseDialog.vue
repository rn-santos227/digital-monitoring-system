<template>

</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { DialogState } from '../../composables/useDialog'
import BaseButton from './BaseButton.vue'

const props = defineProps<{
  dialog: DialogState
}>()

const emit = defineEmits<{
  (event: 'confirm', value?: string): void
  (event: 'cancel'): void
}>()

const promptValue = ref(props.dialog.defaultValue ?? '')

watch(
  () => props.dialog,
  (value) => {
    promptValue.value = value.defaultValue ?? ''
  }
)

const indicatorClass = computed(() => {
  switch (props.dialog.type) {
    case 'success':
      return 'bg-emerald-500'
    case 'warning':
      return 'bg-amber-500'
    case 'error':
      return 'bg-rose-500'
    case 'question':
      return 'bg-violet-500'
    case 'prompt':
      return 'bg-indigo-500'
    default:
      return 'bg-sky-500'
  }
})

</script>