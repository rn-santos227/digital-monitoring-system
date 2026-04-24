<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="DASHBOARD_PAGE_SECTION_CLASSES">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold text-slate-900">{{ DASHBOARD_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ DASHBOARD_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="DASHBOARD_METRICS_GRID_CLASSES">
        <KpiCard
          v-for="card in dashboardKpis"
          :key="card.key"
          :title="card.title"
          :loader="card.loader"
          :icon-name="card.iconName"
          :tone="card.tone"
          :fallback-context="card.context"
        />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import KpiCard, { type KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import {
  DASHBOARD_KPI_CARDS,
  DASHBOARD_METRICS_GRID_CLASSES,
  DASHBOARD_PAGE_SECTION_CLASSES,
  DASHBOARD_PAGE_SUBTITLE,
  DASHBOARD_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'
import {
  getAccountTypeCount,
  getBattalionCount,
  getCompanyCount,
  getPersonnelCount,
} from '~/utils/dashboard-endpoint'

type DashboardKpiCard = (typeof DASHBOARD_KPI_CARDS)[number] & {
  loader: () => Promise<KpiCardLoaderResult>
}

const dashboardKpiLoaders: Record<string, () => Promise<number>> = {
  personnel: getPersonnelCount,
  battalions: getBattalionCount,
  companies: getCompanyCount,
  'account-types': getAccountTypeCount,
}

const dashboardKpis: DashboardKpiCard[] = DASHBOARD_KPI_CARDS.map((card) => {
  return {
    ...card,
    loader: async () => {
      const loadCount = dashboardKpiLoaders[card.key] ?? (async () => 0)

      return {
        value: await loadCount(),
        context: card.context,
      }
    },
  }
})
</script>
