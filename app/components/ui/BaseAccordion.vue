<template>
  <section :class="BASE_ACCORDION_ROOT_CLASSES">
    <button
      type="button"
      :class="BASE_ACCORDION_TRIGGER_CLASSES"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span>{{ title }}</span>
      <BaseIcon
        name="chevron-down"
        size="sm"
        :class="accordionIconClasses"
      />
    </button>

    <Transition
      :enter-active-class="BASE_ACCORDION_TRANSITION_ENTER_ACTIVE_CLASSES"
      :enter-from-class="BASE_ACCORDION_TRANSITION_ENTER_FROM_CLASSES"
      :enter-to-class="BASE_ACCORDION_TRANSITION_ENTER_TO_CLASSES"
      :leave-active-class="BASE_ACCORDION_TRANSITION_LEAVE_ACTIVE_CLASSES"
      :leave-from-class="BASE_ACCORDION_TRANSITION_LEAVE_FROM_CLASSES"
      :leave-to-class="BASE_ACCORDION_TRANSITION_LEAVE_TO_CLASSES"
    >
      <div v-if="isOpen" :class="BASE_ACCORDION_CONTENT_CLASSES">
        <slot />
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  BASE_ACCORDION_CONTENT_CLASSES,
  BASE_ACCORDION_ICON_CLASSES,
  BASE_ACCORDION_ICON_OPEN_CLASSES,
  BASE_ACCORDION_ROOT_CLASSES,
  BASE_ACCORDION_TRANSITION_ENTER_ACTIVE_CLASSES,
  BASE_ACCORDION_TRANSITION_ENTER_FROM_CLASSES,
  BASE_ACCORDION_TRANSITION_ENTER_TO_CLASSES,
  BASE_ACCORDION_TRANSITION_LEAVE_ACTIVE_CLASSES,
  BASE_ACCORDION_TRANSITION_LEAVE_FROM_CLASSES,
  BASE_ACCORDION_TRANSITION_LEAVE_TO_CLASSES,
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

const accordionIconClasses = computed(() =>
  isOpen.value
    ? `${BASE_ACCORDION_ICON_CLASSES} ${BASE_ACCORDION_ICON_OPEN_CLASSES}`
    : BASE_ACCORDION_ICON_CLASSES
)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>
