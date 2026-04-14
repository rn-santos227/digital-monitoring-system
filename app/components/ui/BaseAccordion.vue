<template>
  <section :class="BASE_ACCORDION_ROOT_CLASSES">
    <button
      type="button"
      :class="BASE_ACCORDION_TRIGGER_CLASSES"
      :aria-expanded="String(isOpen)"
      @click="toggle"
    >
      <span>{{ title }}</span>
      <BaseIcon :name="isOpen ? 'chevron-up' : 'chevron-down'" size="sm" />
    </button>

    <div v-if="isOpen" :class="BASE_ACCORDION_CONTENT_CLASSES">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  BASE_ACCORDION_CONTENT_CLASSES,
  BASE_ACCORDION_ROOT_CLASSES,
  BASE_ACCORDION_TRIGGER_CLASSES,
} from '~/constants/ui.constants'

const props = withDefaults(
  defineProps<{
    title: string
    initiallyOpen?: boolean
  }>(),
  {
    initiallyOpen: false,
  }
)

const isOpen = ref(props.initiallyOpen)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>
