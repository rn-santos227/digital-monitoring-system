<template>
  <aside :class="APP_SIDEBAR_CLASSES">
    <div class="border-b border-white/10 px-5 py-5">
      <p class="text-lg font-semibold leading-tight">AFP Monitoring</p>
      <p class="text-sm text-emerald-200">Personnel & Equipment</p>
    </div>

    <nav class="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      <section v-for="section in SIDEBAR_NAVIGATION_SECTIONS" :key="section.title" class="space-y-2">
        <h2 :class="APP_SIDEBAR_SECTION_TITLE_CLASSES">{{ section.title }}</h2>
        <div class="space-y-1">
          <NuxtLink
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            :class="[APP_SIDEBAR_ITEM_BASE_CLASSES, getItemClass(item.to)]"
          >
            <UiBaseIcon :name="item.icon" size="sm" class="shrink-0" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>
      </section>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import {
  APP_SIDEBAR_CLASSES,
  APP_SIDEBAR_ITEM_ACTIVE_CLASSES,
  APP_SIDEBAR_ITEM_BASE_CLASSES,
  APP_SIDEBAR_ITEM_INACTIVE_CLASSES,
  APP_SIDEBAR_SECTION_TITLE_CLASSES
} from '~/constants/ui.constants'
import { useRoute } from 'vue-router'
import { SIDEBAR_FOOTER_ITEMS, SIDEBAR_NAVIGATION_SECTIONS } from '~/constants/navigation.constants'

const route = useRoute()

const getItemClass = (path: string) => {
  const isActive = route.path === path

  if (isActive) {
    return APP_SIDEBAR_ITEM_ACTIVE_CLASSES
  }

  return APP_SIDEBAR_ITEM_INACTIVE_CLASSES
}
</script>