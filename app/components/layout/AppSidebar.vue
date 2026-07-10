<template>
  <aside :class="sidebarClasses">
    <div class="border-b border-white/10 px-6 py-5">
      <BaseInlineLoader
        v-if="isSidebarBrandingLoading"
        label="Loading application branding..."
        class="text-white [&>span:first-child]:border-white [&>span:first-child]:border-t-transparent"
      />
      <p v-else class="mt-1 text-lg font-semibold text-white">Operations Console</p>
    </div>

    <nav class="flex-1 overflow-y-auto px-3 py-4">
      <section
        v-for="section in filteredSidebarNavigationSections"
        :key="section.title"
        class="mb-5 space-y-2"
      >
        <h2 :class="sidebarSectionTitleClasses">{{ section.title }}</h2>
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
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { SIDEBAR_FOOTER_ITEMS, SIDEBAR_NAVIGATION_SECTIONS } from '~/constants/navigation.constants'
import { useApplicationSettingsStore } from '~/stores/application-settings'
import { useAuthStore } from '~/stores/auth'
import type { IconName, NavigationItem } from '~/types/domain/misc'
import {
  APP_SIDEBAR_COLLAPSED_WIDTH_CLASSES,
  APP_SIDEBAR_CLASSES,
  APP_SIDEBAR_EXPANDED_WIDTH_CLASSES,
  APP_SIDEBAR_ICON_COLLAPSED_CLASSES,
  APP_SIDEBAR_ICON_EXPANDED_CLASSES,
  APP_SIDEBAR_ITEM_BASE_CLASSES,
  APP_SIDEBAR_ITEM_THEME_CLASSES,
  APP_SIDEBAR_LABEL_COLLAPSED_CLASSES,
  APP_SIDEBAR_LABEL_EXPANDED_CLASSES,
  APP_SIDEBAR_SECTION_TITLE_CLASSES,
  APP_SIDEBAR_THEME_CLASSES,
  APP_SIDEBAR_TOGGLE_BUTTON_CLASSES,
} from '~/constants/ui.constants'

const route = useRoute()
const authStore = useAuthStore()
const applicationSettingsStore = useApplicationSettingsStore()
const { hasLoaded: hasApplicationSettingsLoaded, item: applicationSettingsItem } = storeToRefs(applicationSettingsStore)
const isSidebarMinimized = ref(false)

const isSidebarBrandingLoading = computed(() => !hasApplicationSettingsLoaded.value)

const resolvedTheme = computed(() => {
  const appTheme = applicationSettingsItem.value?.appTheme ?? 'light'

  return appTheme as keyof typeof APP_SIDEBAR_THEME_CLASSES
})

const sidebarClasses = computed(() => {
  const themeKey = resolvedTheme.value
  const themeClasses = APP_SIDEBAR_THEME_CLASSES[themeKey] ?? APP_SIDEBAR_THEME_CLASSES.light
  const widthClasses = isSidebarMinimized.value ? APP_SIDEBAR_COLLAPSED_WIDTH_CLASSES : APP_SIDEBAR_EXPANDED_WIDTH_CLASSES

  return [APP_SIDEBAR_CLASSES, widthClasses, themeClasses]
})

const brandingClasses = computed(() => [
  'flex shrink-0 items-center border-b border-white/10 py-5',
  isSidebarMinimized.value ? 'justify-center px-3' : 'justify-between gap-3 px-6',
])

const brandTitleClasses = computed(() => [
  'mt-1 text-lg font-semibold text-white',
  isSidebarMinimized.value ? 'sr-only' : 'truncate',
])

const navigationClasses = computed(() => [
  'min-h-0 flex-1 overflow-y-auto px-3 py-4',
])

const footerClasses = computed(() => [
  'shrink-0 border-t border-white/10 px-3 py-4',
])

const sidebarLabelClasses = computed(() => {
  return isSidebarMinimized.value ? APP_SIDEBAR_LABEL_COLLAPSED_CLASSES : APP_SIDEBAR_LABEL_EXPANDED_CLASSES
})

const sidebarIconClasses = computed(() => {
  return isSidebarMinimized.value ? APP_SIDEBAR_ICON_COLLAPSED_CLASSES : APP_SIDEBAR_ICON_EXPANDED_CLASSES
})

const sidebarSectionTitleClasses = computed(() => {
  const themeKey = resolvedTheme.value
  const itemTheme = APP_SIDEBAR_ITEM_THEME_CLASSES[themeKey] ?? APP_SIDEBAR_ITEM_THEME_CLASSES.light

  return [
    APP_SIDEBAR_SECTION_TITLE_CLASSES,
    itemTheme.sectionTitle,
    isSidebarMinimized.value ? 'sr-only' : '',
  ]
})

const sidebarToggleLabel = computed(() => {
  return isSidebarMinimized.value ? 'Expand sidebar' : 'Minimize sidebar'
})

const sidebarToggleIconName = computed<IconName>(() => {
  return isSidebarMinimized.value ? 'chevron-right' : 'chevron-left'
})

const toggleSidebar = () => {
  isSidebarMinimized.value = !isSidebarMinimized.value
}

const hasPermissionAccess = (item: NavigationItem) => {
  if (item.requiredPermissionMode === 'any') {
    return authStore.hasAnyPermissionAccess(item.requiredPermissions)
  }

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
  const itemTheme = APP_SIDEBAR_ITEM_THEME_CLASSES[resolvedTheme.value] ?? APP_SIDEBAR_ITEM_THEME_CLASSES.light

  return [
    APP_SIDEBAR_ITEM_BASE_CLASSES,
    isSidebarMinimized.value ? 'justify-center px-2' : '',
    isActive ? itemTheme.active : itemTheme.inactive,
  ]
}

onMounted(async () => {
  if (applicationSettingsStore.hasLoaded) {
    return
  }

  try {
    await applicationSettingsStore.initialize()
  } catch {
    // Keep fallback sidebar branding when settings are unavailable.
  }
})
</script>
