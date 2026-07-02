<template>
  <div :class="BASE_VIEW_TOGGLE_LIST_CLASSES" role="group" :aria-label="ariaLabel">
    <button
      v-for="item in viewModeItems"
      :key="item.id"
      type="button"
      :aria-label="item.label"
      :aria-pressed="item.id === modelValue"
      :title="item.label"
      :class="[
        BASE_VIEW_TOGGLE_BUTTON_CLASSES,
        item.id === modelValue ? BASE_VIEW_TOGGLE_ACTIVE_CLASSES : BASE_VIEW_TOGGLE_INACTIVE_CLASSES
      ]"
      @click="emit('update:modelValue', item.id)"
    >
      <component
        :is="item.icon"
        :class="BASE_VIEW_TOGGLE_ICON_CLASSES"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Squares2X2Icon, TableCellsIcon } from '@heroicons/vue/24/outline'
import type { Component } from 'vue'
import {
  BASE_VIEW_TOGGLE_ACTIVE_CLASSES,
  BASE_VIEW_TOGGLE_BUTTON_CLASSES,
  BASE_VIEW_TOGGLE_ICON_CLASSES,
  BASE_VIEW_TOGGLE_INACTIVE_CLASSES,
  BASE_VIEW_TOGGLE_LIST_CLASSES,
  LIST_VIEW_MODE_ITEMS,
  type ListViewMode
} from '~/constants/ui.constants'

type ViewToggleItem = {
  id: ListViewMode
  label: string
  icon: Component
}

withDefaults(defineProps<{
  modelValue: ListViewMode
  ariaLabel?: string
}>(), {
  ariaLabel: 'List view mode',
})

const viewModeIconMap: Record<ListViewMode, Component> = {
  table: TableCellsIcon,
  card: Squares2X2Icon,
}

const isListViewMode = (value: string): value is ListViewMode => value === 'table' || value === 'card'

const viewModeItems: readonly ViewToggleItem[] = LIST_VIEW_MODE_ITEMS.map(item => {
  const id = isListViewMode(item.id) ? item.id : 'table'
  const icon = viewModeIconMap[id] ?? TableCellsIcon

  return {
    id,
    label: item.label,
    icon,
  }
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: ListViewMode): void
}>()
</script>
