<template>
  <span :class="[BASE_IMAGE_CLASSES, sizeClasses]" role="img" :aria-label="computedAlt">
    <img
      v-if="shouldRenderImage"
      :src="src"
      :alt="computedAlt"
      :class="BASE_IMAGE_ELEMENT_CLASSES"
      @error="handleImageError"
    >
    <span v-else :class="[BASE_IMAGE_FALLBACK_CLASSES, textSizeClasses]">{{ fallbackLabel }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  BASE_IMAGE_CLASSES,
  BASE_IMAGE_ELEMENT_CLASSES,
  BASE_IMAGE_FALLBACK_CLASSES,
} from '~/constants/ui.constants'

const props = withDefaults(defineProps<{
  src?: string
  alt?: string
  fallbackText?: string
  size?: 'sm' | 'md' | 'lg'
}>(), {
  src: '',
  alt: 'Image',
  fallbackText: '',
  size: 'md',
})

const hasImageError = ref(false)

watch(() => props.src, () => {
  hasImageError.value = false
})

const shouldRenderImage = computed(() => {
  return Boolean(props.src) && !hasImageError.value
})

const computedAlt = computed(() => {
  return props.alt?.trim() || 'Image'
})

const fallbackLabel = computed(() => {
  const normalizedFallback = props.fallbackText.trim()

  if (normalizedFallback) {
    return normalizedFallback.slice(0, 2)
  }

  return computedAlt.value.slice(0, 2)
})

const sizeClasses = computed(() => {
  if (props.size === 'sm') {
    return 'h-8 w-8'
  }

  if (props.size === 'lg') {
    return 'h-12 w-12'
  }

  return 'h-10 w-10'
})

const textSizeClasses = computed(() => {
  if (props.size === 'sm') {
    return 'text-xs'
  }

  if (props.size === 'lg') {
    return 'text-base'
  }

  return 'text-sm'
})

const handleImageError = () => {
  hasImageError.value = true
}
</script>
