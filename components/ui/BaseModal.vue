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


</script>
