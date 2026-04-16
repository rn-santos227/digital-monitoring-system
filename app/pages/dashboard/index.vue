<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <section :class="DASHBOARD_PAGE_SECTION_CLASSES">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold text-slate-900">{{ DASHBOARD_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ DASHBOARD_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="DASHBOARD_METRICS_GRID_CLASSES">
        <BaseCard
          v-for="metric in DASHBOARD_METRICS"
          :key="metric.label"
          :title="metric.label"
        >
          <p :class="DASHBOARD_METRIC_VALUE_CLASSES">{{ metric.value }}</p>
          <p :class="DASHBOARD_METRIC_CHANGE_CLASSES">{{ metric.change }}</p>
        </BaseCard>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  DASHBOARD_METRIC_CHANGE_CLASSES,
  DASHBOARD_METRIC_VALUE_CLASSES,
  DASHBOARD_METRICS,
  DASHBOARD_METRICS_GRID_CLASSES,
  DASHBOARD_PAGE_SECTION_CLASSES,
  DASHBOARD_PAGE_SUBTITLE,
  DASHBOARD_PAGE_TITLE,
} from '~/constants/page.constants'
</script>
