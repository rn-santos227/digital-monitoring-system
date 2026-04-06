<template>
  <Transition name="modal-fade">
    <div
      v-if="loadingStore.isLoading"
      class="fixed inset-0 z-100 flex items-center justify-center bg-slate-900/45 px-4"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div class="flex min-w-55 items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-xl">
        <span
          class="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent"
          aria-hidden="true"
        />
        <p class="text-sm font-medium text-slate-700">
          {{ loadingStore.message }}
        </p>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useLoadingStore } from '../../stores/loading'

const loadingStore = useLoadingStore()
</script>
