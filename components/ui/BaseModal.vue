<template>

</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue'
import type { ModalSize } from '../../composables/useModal'

const props = withDefaults(
  defineProps<{
    title?: string
    description?: string
    size?: ModalSize
    closeOnBackdrop?: boolean
  }>(),
  {
    title: '',
    description: '',
    size: 'md',
    closeOnBackdrop: true
  }
)

const emit = defineEmits<{
  (event: 'close'): void
}>()

const titleId = computed(() =>
  `modal-title-${props.title.toLowerCase().replace(/\s+/g, '-') || 'content'}`
)

</script>
