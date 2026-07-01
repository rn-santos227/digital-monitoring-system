<template>
  <section class="space-y-4">
    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
      <slot />
    </div>

    <div v-if="isLoading" class="flex justify-center py-4">
      <BaseInlineLoader label="Loading records..." />
    </div>

    <p v-else-if="isEmpty" class="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center text-sm text-slate-500">
      {{ emptyMessage }}
    </p>

    <div ref="sentinel" class="h-8" aria-hidden="true" />
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import BaseInlineLoader from '~/components/ui/BaseInlineLoader.vue'

const props = withDefaults(defineProps<{
  canLoadMore?: boolean
  isLoading?: boolean
  isEmpty?: boolean
  emptyMessage?: string
}>(), {
  canLoadMore: false,
  isLoading: false,
  isEmpty: false,
  emptyMessage: 'No records found.',
})

const emit = defineEmits<{
  (event: 'loadMore'): void
}>()

const sentinel = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const createObserver = () => {
  if (!sentinel.value || typeof IntersectionObserver === 'undefined') {
    return
  }

  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry?.isIntersecting && props.canLoadMore && !props.isLoading) {
      emit('loadMore')
    }
  }, { rootMargin: '320px 0px' })

  observer.observe(sentinel.value)
}

onMounted(createObserver)

watch(() => sentinel.value, () => {
  observer?.disconnect()
  createObserver()
})

onBeforeUnmount(() => observer?.disconnect())
</script>
