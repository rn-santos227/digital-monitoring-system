<template>
  <div class="inline-flex items-center gap-2 text-sm text-slate-600" role="status" aria-live="polite" aria-busy="true">
    <span
      class="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
      aria-hidden="true"
    />
    <span>{{ normalizedLabel }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  label?: string
}>(), {
  label: 'Loading...'
})

const normalizedLabel = computed(() => props.label?.trim() || 'Loading...')
</script>
