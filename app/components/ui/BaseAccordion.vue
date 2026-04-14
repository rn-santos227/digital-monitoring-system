<template>

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
