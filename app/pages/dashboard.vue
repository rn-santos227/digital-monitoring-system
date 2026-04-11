<template>
  <section :class="DASHBOARD_PAGE_SECTION_CLASSES">
    <header>
      <h1 class="text-3xl font-semibold text-slate-900">{{ DASHBOARD_PAGE_TITLE }}</h1>
      <p class="mt-1 text-sm text-slate-500">{{ DASHBOARD_PAGE_SUBTITLE }}</p>
    </header>
  </section>
</template>

<script setup lang="ts">
import {
  DASHBOARD_METRICS,
  DASHBOARD_METRIC_CHANGE_CLASSES,
  DASHBOARD_METRIC_VALUE_CLASSES,
  DASHBOARD_METRICS_GRID_CLASSES,
  DASHBOARD_PAGE_SECTION_CLASSES,
  DASHBOARD_PAGE_SUBTITLE,
  DASHBOARD_PAGE_TITLE,
  DASHBOARD_PLACEHOLDER_CARDS,
  DASHBOARD_SECONDARY_GRID_CLASSES
} from '~/constants/page.constants'
</script>