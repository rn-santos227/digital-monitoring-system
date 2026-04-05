<template>
  <div
    class="pointer-events-auto w-full max-w-sm rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur"
    role="status"
  >
    <div class="flex items-start gap-3">
      <div
        class="mt-1 h-2.5 w-2.5 rounded-full"
        :class="variantClass"
        aria-hidden="true"
      />
      <div class="flex-1 space-y-1">
        <p class="text-sm font-semibold text-slate-900">{{ title }}</p>
        <p v-if="message" class="text-sm text-slate-600">
          {{ message }}
        </p>
      </div>
      <button
        type="button"
        class="text-slate-400 transition hover:text-slate-600"
        aria-label="Dismiss notification"
        @click="emit('dismiss')"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ToastVariant } from '../../composables/useToast'

const props = withDefaults(
  defineProps<{
    title: string
    message?: string
    variant?: ToastVariant
  }>(),
  {
    message: '',
    variant: 'info'
  }
)

const emit = defineEmits<{
  (event: 'dismiss'): void
}>()

const variantClass = computed(() => {
  switch (props.variant) {
    case 'success':
      return 'bg-emerald-500'
    case 'error':
      return 'bg-rose-500'
    case 'warning':
      return 'bg-amber-500'
    default:
      return 'bg-sky-500'
  }
})
</script>
