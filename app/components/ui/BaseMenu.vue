<template>
  <div ref="menuRoot" class="relative inline-flex">
    <button
      type="button"
      :class="BASE_MENU_TRIGGER_CLASSES"
      :aria-expanded="isOpen"
      aria-haspopup="menu"
      @click="toggleMenu"
    >
      <slot name="trigger" :is-open="isOpen">
        <span>{{ label }}</span>
      </slot>
    </button>

    <Transition name="dropdown-slide">
      <div
        v-if="isOpen"
        :class="[BASE_MENU_PANEL_CLASSES, menuPositionClass]"
        role="menu"
      >
        <button
          v-for="item in items"
          :key="item.value"
          type="button"
          :class="[BASE_MENU_ITEM_CLASSES, item.danger ? BASE_MENU_ITEM_DANGER_CLASSES : BASE_MENU_ITEM_DEFAULT_CLASSES]"
          role="menuitem"
          @click="onItemClick(item)"
        >
          {{ item.label }}
        </button>
      </div>
    </Transition>
  </div>
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

const menuPositionClass = computed(() => {
  if (props.align === 'left') {
    return 'left-0'
  }

  return 'right-0'
})

const closeMenu = () => {
  isOpen.value = false
}

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const onItemClick = (item: BaseMenuItem) => {
  emit('select', item)
  closeMenu()
}

const onDocumentClick = (event: MouseEvent) => {
  if (!menuRoot.value) return

  const target = event.target
  if (!(target instanceof Node)) return

  if (!menuRoot.value.contains(target)) {
    closeMenu()
  }
}

const onDocumentKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>
