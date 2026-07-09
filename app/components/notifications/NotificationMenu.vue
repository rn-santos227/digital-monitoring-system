<template>
  <div ref="menuRoot" class="relative inline-flex">
    <button
      type="button"
      class="relative rounded-full p-2 text-slate-500 transition hover:bg-emerald-200/70 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
      aria-label="Notifications"
      :aria-expanded="isOpen"
      @click="toggleMenu"
    >
      <BaseIcon name="bell" class="h-5 w-5" />
      <span
        v-if="unreadCount > 0"
        class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white"
      >
        {{ unreadCountLabel }}
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useNotificationMenuHandler } from '~/handlers/notifications'

const {
  items,
  unreadCount,
  unreadCountLabel,
  isLoading,
  isMarkingRead,
  menuRoot,
  isOpen,
  closeMenu,
  toggleMenu,
  markRead,
  formatNotificationDate,
} = useNotificationMenuHandler()
</script>
