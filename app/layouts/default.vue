<template>
  <div class="flex min-h-screen flex-col bg-slate-50 text-slate-900">
    <main class="flex flex-1">
      <slot />
    </main>
    <StackModal />
    <StackToast />
    <StackDialog />
  </div>
</template>

<script setup lang="ts">
import StackToast from '../components/ui/StackToast.vue'
import StackDialog from '../components/ui/StackDialog.vue'
import StackModal from '../components/ui/StackModal.vue'
</script>
