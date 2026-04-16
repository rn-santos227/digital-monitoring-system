<template>
  <aside :class="APP_SIDEBAR_CLASSES">
    <div class="border-b border-white/10 px-6 py-5">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-200">AFP Monitoring</p>
      <p class="mt-1 text-lg font-semibold text-white">Operations Console</p>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-4">
      <section
        v-for="section in filteredSidebarNavigationSections"
        :key="section.title"
        class="mb-5 space-y-2"
      >
        <h2 :class="APP_SIDEBAR_SECTION_TITLE_CLASSES">{{ section.title }}</h2>
        <NuxtLink
          v-for="item in section.items"
          :key="item.to"
          :to="item.to"
          :class="resolveItemClasses(item.to)"
        >
          <BaseIcon :name="item.icon" size="sm" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </section>
    </nav>

    <div class="border-t border-white/10 px-3 py-4">
      <NuxtLink
        v-for="item in filteredSidebarFooterItems"
        :key="item.to"
        :to="item.to"
        :class="resolveItemClasses(item.to)"
      >
        <BaseIcon :name="item.icon" size="sm" />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { SIDEBAR_FOOTER_ITEMS, SIDEBAR_NAVIGATION_SECTIONS } from '~/constants/navigation.constants'
import { useAuthStore } from '~/stores/auth'
import type { NavigationItem } from '~/types/domain/misc'
import {
  APP_SIDEBAR_CLASSES,
  APP_SIDEBAR_ITEM_ACTIVE_CLASSES,
  APP_SIDEBAR_ITEM_BASE_CLASSES,
  APP_SIDEBAR_ITEM_INACTIVE_CLASSES,
  APP_SIDEBAR_SECTION_TITLE_CLASSES,
} from '~/constants/ui.constants'

const route = useRoute()
const authStore = useAuthStore()

const hasPermissionAccess = (item: NavigationItem) => {
  return authStore.hasPermissionAccess(item.requiredPermissions)
}

const filteredSidebarNavigationSections = computed(() => {
  return SIDEBAR_NAVIGATION_SECTIONS
    .map((section) => {
      const filteredItems = section.items.filter(hasPermissionAccess)

      return {
        ...section,
        items: filteredItems,
      }
    })
    .filter((section) => section.items.length > 0)
})

const filteredSidebarFooterItems = computed(() => {
  return SIDEBAR_FOOTER_ITEMS.filter(hasPermissionAccess)
})

const resolveItemClasses = (path: string) => {
  const isActive = route.path === path

  return [
    APP_SIDEBAR_ITEM_BASE_CLASSES,
    isActive ? APP_SIDEBAR_ITEM_ACTIVE_CLASSES : APP_SIDEBAR_ITEM_INACTIVE_CLASSES,
  ]
}
</script>
