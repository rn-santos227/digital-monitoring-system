<template>
  <div :class="alertClasses" role="alert">
    <p v-if="title" class="font-semibold">{{ title }}</p>
    <p>{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  BASE_ALERT_CLASSES,
  BASE_ALERT_TONE_CLASSES,
  type UiTone,
} from '~/constants/ui.constants'

const props = withDefaults(
  defineProps<{
    title?: string
    message: string
    tone?: UiTone
  }>(),
  {
    title: '',
    tone: 'danger',
  }
)

const alertClasses = computed(() => {
  return [BASE_ALERT_CLASSES, BASE_ALERT_TONE_CLASSES[props.tone]]
})
</script>
