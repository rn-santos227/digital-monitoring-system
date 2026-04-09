<template>

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