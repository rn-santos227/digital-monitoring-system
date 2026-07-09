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

    <Transition name="dropdown-slide">
      <section
        v-if="isOpen"
        class="absolute right-0 top-11 z-40 w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
        aria-label="Notifications panel"
      >
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div>
            <p class="text-sm font-semibold text-slate-900">Notifications</p>
            <p class="text-xs text-slate-500">Temporarily cached activity alerts</p>
          </div>
          <BaseButton
            v-if="unreadCount > 0"
            size="sm"
            variant="ghost"
            :disabled="isMarkingRead"
            @click="markRead"
          >
            Mark read
          </BaseButton>
        </div>
      </section>
    </Transition>
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
