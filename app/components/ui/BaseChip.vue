<template>
  <span :class="[BASE_CHIP_CLASSES, BASE_CHIP_TONE_CLASSES[tone]]">
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
import { BASE_CHIP_CLASSES, BASE_CHIP_TONE_CLASSES, type UiTone } from '~/constants/ui.constants'

withDefaults(
  defineProps<{
    label?: string
    tone?: UiTone
  }>(),
  {
    label: '',
    tone: 'neutral'
  }
)
</script>
