<template>
  <footer :class="APP_FOOTER_CLASSES">
    <p>© {{ currentYear }} AFP Personnel and Equipment Monitoring System. All rights reserved.</p>
  </footer>
</template>

<script setup lang="ts">
import { APP_FOOTER_CLASSES } from '~/constants/ui.constants'

const currentYear = new Date().getFullYear()
</script>
