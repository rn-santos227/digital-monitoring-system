<template>
  <!-- <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="REPORTS_PAGE_SECTION_CLASSES">
      <header class="flex flex-col gap-4 print:block sm:flex-row sm:items-start sm:justify-between">
        <div class="space-y-2">
          <h1 class="text-3xl font-semibold text-slate-900">{{ REPORTS_PAGE_TITLE }}</h1>
          <p class="max-w-3xl text-sm text-slate-600">{{ REPORTS_PAGE_SUBTITLE }}</p>
        </div>
        <BaseButton class="print:hidden" @click="handlePrintReport">
          {{ REPORTS_PRINT_BUTTON_LABEL }}
        </BaseButton>
      </header>

      <BaseAlert
        v-if="reportLoadError"
        title="Unable to load reports"
        :message="reportLoadError"
        tone="danger"
      />

      <BaseTab
        v-model="activeTab"
        class="print:hidden"
        :items="REPORTS_TAB_ITEMS"
        :aria-label="REPORTS_TABS_ARIA_LABEL"
      />

      <section v-if="activeTab === 'personnel'" class="space-y-6">
        <h2 class="sr-only">{{ REPORTS_PERSONNEL_TAB_TITLE }}</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <BaseCard v-for="metric in personnelMetrics" :key="metric.label" :title="metric.label">
            <p class="text-3xl font-semibold text-slate-900">{{ metric.value }}</p>
            <p class="mt-2 text-sm text-slate-500">{{ metric.description }}</p>
          </BaseCard>
        </div>
        <div class="grid gap-4 xl:grid-cols-2">
          <ReportDonutChart title="Personnel by Service Status" subtitle="Current service status distribution." :data="personnelServiceStatusChart" />
          <ReportBarChart title="Personnel by Battalion" subtitle="Personnel records grouped by battalion assignment." :data="personnelBattalionChart" />
          <ReportBarChart title="Personnel by Company" subtitle="Personnel records grouped by company assignment." :data="personnelCompanyChart" />
          <ReportDonutChart title="Personnel by Sex" subtitle="Personnel record sex distribution." :data="personnelSexChart" />
          <ReportLineChart title="Personnel Records Timeline" subtitle="Personnel records grouped by creation month." :data="personnelTimelineChart" />
        </div>
      </section>

      <section v-else class="space-y-6">
        <h2 class="sr-only">{{ REPORTS_EQUIPMENT_TAB_TITLE }}</h2>
        <div class="grid gap-4 md:grid-cols-3">
          <BaseCard v-for="metric in equipmentMetrics" :key="metric.label" :title="metric.label">
            <p class="text-3xl font-semibold text-slate-900">{{ metric.value }}</p>
            <p class="mt-2 text-sm text-slate-500">{{ metric.description }}</p>
          </BaseCard>
        </div>
        <div class="grid gap-4 xl:grid-cols-2">
          <ReportDonutChart title="Assets by Asset Status" subtitle="Equipment asset lifecycle status distribution." :data="equipmentAssetStatusChart" />
          <ReportDonutChart title="Assets by Serviceability" subtitle="Operational serviceability distribution." :data="equipmentServiceabilityChart" />
          <ReportBarChart title="Assets by Equipment Item" subtitle="Assets grouped by equipment item." :data="equipmentItemsChart" />
          <ReportBarChart title="Assets by Current Location" subtitle="Assets grouped by recorded current location." :data="equipmentLocationChart" />
          <ReportLineChart title="Equipment Assets Timeline" subtitle="Equipment assets grouped by procurement or record creation month." :data="equipmentTimelineChart" />
        </div>
      </section>

      <BaseCard :title="REPORTS_SUMMARY_CARD_TITLE" :subtitle="REPORTS_SUMMARY_CARD_SUBTITLE">
        <dl class="grid gap-4 md:grid-cols-3">
          <div v-for="metric in activeMetrics" :key="metric.label" class="rounded-xl bg-slate-50 p-4">
            <dt class="text-sm font-medium text-slate-600">{{ metric.label }}</dt>
            <dd class="mt-2 text-2xl font-semibold text-slate-900">{{ metric.value }}</dd>
            <p class="mt-1 text-xs text-slate-500">{{ metric.description }}</p>
          </div>
        </dl>
      </BaseCard>
    </section>
  </main> -->
</template>

<script setup lang="ts">
import ReportBarChart from '~/components/charts/ReportBarChart.vue'
import ReportDonutChart from '~/components/charts/ReportDonutChart.vue'
import ReportLineChart from '~/components/charts/ReportLineChart.vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseTab from '~/components/ui/BaseTab.vue'
import {
  REPORTS_EQUIPMENT_TAB_TITLE,
  REPORTS_PAGE_SECTION_CLASSES,
  REPORTS_PAGE_SUBTITLE,
  REPORTS_PAGE_TITLE,
  REPORTS_PERSONNEL_TAB_TITLE,
  REPORTS_PRINT_BUTTON_LABEL,
  REPORTS_SUMMARY_CARD_SUBTITLE,
  REPORTS_SUMMARY_CARD_TITLE,
  REPORTS_TAB_ITEMS,
  REPORTS_TABS_ARIA_LABEL,
} from '~/constants/page.constants'
import type { ChartDataPoint, ReportChartsResponse, ReportTabId } from '~/types/domain/reports'
import { extractApiErrorMessage } from '~/utils/api-request'
import { getPersonnelEndpoint } from '~/utils/personnel-endpoints'


</script>
