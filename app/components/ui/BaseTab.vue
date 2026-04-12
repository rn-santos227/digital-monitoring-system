<template>
  <div :class="BASE_TAB_LIST_CLASSES" role="tablist" :aria-label="ariaLabel">
    <button
      v-for="item in items"
      :key="item.id"
      type="button"
      role="tab"
      :disabled="item.disabled"
      :aria-selected="item.id === modelValue"
      :class="[
        BASE_TAB_ITEM_CLASSES,
        item.id === modelValue ? BASE_TAB_ACTIVE_CLASSES : BASE_TAB_INACTIVE_CLASSES
      ]"
      @click="emit('update:modelValue', item.id)"
    >
      {{ item.label }}
    </button>
  </div>
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
