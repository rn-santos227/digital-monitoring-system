<template>
  <footer :class="footerClasses">
    <p>© {{ currentYear }} AFP Personnel and Equipment Monitoring System. All rights reserved.</p>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { APP_FOOTER_CLASSES, APP_SURFACE_THEME_CLASSES } from '~/constants/ui.constants'
import { useApplicationSettingsStore } from '~/stores/application-settings'

const applicationSettingsStore = useApplicationSettingsStore()
const { item: applicationSettingsItem } = storeToRefs(applicationSettingsStore)
const resolvedTheme = computed(() => (applicationSettingsItem.value?.appTheme ?? 'light') as keyof typeof APP_SURFACE_THEME_CLASSES)
const footerClasses = computed(() => [APP_FOOTER_CLASSES, 'border-t', APP_SURFACE_THEME_CLASSES[resolvedTheme.value] ?? APP_SURFACE_THEME_CLASSES.light])
const currentYear = new Date().getFullYear()
</script>

