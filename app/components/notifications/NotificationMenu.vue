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

        <div class="max-h-96 overflow-y-auto py-2">
          <div v-if="isLoading" class="px-4 py-6 text-center text-sm text-slate-500">
            Loading notifications...
          </div>

          <div v-else-if="items.length === 0" class="px-4 py-6 text-center text-sm text-slate-500">
            No cached notifications yet.
          </div>

          <NuxtLink
            v-for="item in items"
            v-else
            :key="item.id"
            :to="item.sourcePath ?? '#'"
            class="block border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50"
            @click="closeMenu"
          >
            <div class="flex items-start gap-3">
              <span :class="['mt-1 h-2.5 w-2.5 rounded-full', item.isRead ? 'bg-slate-300' : 'bg-emerald-600']" />
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-semibold text-slate-900">{{ item.title }}</p>
                  <span class="shrink-0 text-[11px] text-slate-400">{{ formatNotificationDate(item.createdAt) }}</span>
                </div>
                <p class="mt-1 text-xs leading-5 text-slate-600">{{ item.message }}</p>
              </div>
            </div>
          </NuxtLink>
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
