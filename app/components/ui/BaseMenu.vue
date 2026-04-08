<template>

</template>

<script setup lang="ts">
import {
  BASE_MENU_ITEM_CLASSES,
  BASE_MENU_ITEM_DANGER_CLASSES,
  BASE_MENU_ITEM_DEFAULT_CLASSES,
  BASE_MENU_PANEL_CLASSES,
  BASE_MENU_TRIGGER_CLASSES
} from '~/constants/ui.constants'
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { BaseMenuItem } from '~/types/domain/misc'

const props = withDefaults(
  defineProps<{
    label?: string
    items: BaseMenuItem[]
    align?: 'left' | 'right'
  }>(),
  {
    label: 'Menu',
    align: 'right'
  }
)

const emit = defineEmits<{
  (event: 'select', item: BaseMenuItem): void
}>()

const isOpen = ref(false)
const menuRoot = ref<HTMLElement | null>(null)

</script>
