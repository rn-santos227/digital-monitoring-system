<template>

</template>

<script setup lang="ts">
import {
  BASE_TAB_ACTIVE_CLASSES,
  BASE_TAB_INACTIVE_CLASSES,
  BASE_TAB_ITEM_CLASSES,
  BASE_TAB_LIST_CLASSES,
  type BaseTabItem
} from '~/constants/ui.constants'

withDefaults(
  defineProps<{
    modelValue: string
    items: readonly BaseTabItem[]
    ariaLabel?: string
  }>(),
  {
    ariaLabel: 'Content tabs'
  }
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
}>()
</script>
