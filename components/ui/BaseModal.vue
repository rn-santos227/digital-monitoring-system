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

const sizeClass = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'max-w-md'
    case 'lg':
      return 'max-w-3xl'
    case 'xl':
      return 'max-w-5xl'
    default:
      return 'max-w-xl'
  }
})

const handleBackdrop = () => {
  if (!props.closeOnBackdrop) {
    return
  }

  emit('close')
}

const lockBodyScroll = () => {
  if (typeof document === 'undefined') {
    return
  }

  const body = document.body
  const activeCount = Number(body.dataset.modalCount ?? '0')

  if (activeCount === 0) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }
    body.classList.add('overflow-hidden')
  }

  body.dataset.modalCount = String(activeCount + 1)
}

const unlockBodyScroll = () => {
  if (typeof document === 'undefined') {
    return
  }

  const body = document.body
  const activeCount = Number(body.dataset.modalCount ?? '1')
  const nextCount = Math.max(activeCount - 1, 0)

  if (nextCount === 0) {
    body.classList.remove('overflow-hidden')
    body.style.paddingRight = ''
    delete body.dataset.modalCount
  } else {
    body.dataset.modalCount = String(nextCount)
  }
}

onMounted(() => {
  lockBodyScroll()
})

onBeforeUnmount(() => {
  unlockBodyScroll()
})
</script>
