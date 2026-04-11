<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
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

      <BaseCard
        class="print:hidden"
        :title="REPORTS_DATE_RANGE_TITLE"
        :subtitle="REPORTS_DATE_RANGE_SUBTITLE"
      >
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1fr_auto] lg:items-end">
          <BaseDatePicker
            v-model="dateRange.dateFrom"
            :label="REPORTS_DATE_FROM_LABEL"
            :max="dateRange.dateTo || undefined"
          />
          <BaseDatePicker
            v-model="dateRange.dateTo"
            :label="REPORTS_DATE_TO_LABEL"
            :min="dateRange.dateFrom || undefined"
            :error="dateRangeError"
          />
          <div class="flex gap-2">
            <BaseButton @click="handleApplyDateRange">
              {{ REPORTS_APPLY_DATE_RANGE_LABEL }}
            </BaseButton>
            <BaseButton variant="secondary" @click="handleClearDateRange">
              {{ REPORTS_CLEAR_DATE_RANGE_LABEL }}
            </BaseButton>
          </div>
        </div>
      </BaseCard>

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
  </main>
</template>

<script setup lang="ts">
import {
  useReportPrintHandler,
  createEmptyReportChartsResponse,
  createReportDateRangeHandlers,
  loadReportCharts,
} from '~/handlers/reports'
import ReportBarChart from '~/components/charts/ReportBarChart.vue'
import ReportDonutChart from '~/components/charts/ReportDonutChart.vue'
import ReportLineChart from '~/components/charts/ReportLineChart.vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseDatePicker from '~/components/ui/BaseDatePicker.vue'
import BaseTab from '~/components/ui/BaseTab.vue'
import {
  REPORTS_EQUIPMENT_TAB_TITLE,
  REPORTS_APPLY_DATE_RANGE_LABEL,
  REPORTS_CLEAR_DATE_RANGE_LABEL,
  REPORTS_DATE_FROM_LABEL,
  REPORTS_DATE_RANGE_SUBTITLE,
  REPORTS_DATE_RANGE_TITLE,
  REPORTS_DATE_TO_LABEL,
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
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'
import type {
  ChartDataPoint,
  ReportChartsResponse,
  ReportDateRange,
  ReportTabId,
} from '~/types/domain/reports'

const activeTab = ref<ReportTabId>('personnel')
const reportLoadError = ref('')
const reportChartsResponse = ref<ReportChartsResponse>(createEmptyReportChartsResponse())
const dateRange = reactive<ReportDateRange>({ dateFrom: '', dateTo: '' })
const dateRangeError = ref('')

onMounted(async () => {
  await loadReportCharts({
    reportChartsResponse,
    reportLoadError,
  })
})

const { handleApplyDateRange, handleClearDateRange } = createReportDateRangeHandlers({
  reportChartsResponse,
  reportLoadError,
  dateRange,
  dateRangeError,
})

const personnelCharts = computed(() => reportChartsResponse.value.personnel.charts)
const equipmentCharts = computed(() => reportChartsResponse.value.equipment.charts)

const personnelServiceStatusChart = computed<ChartDataPoint[]>(() => personnelCharts.value.serviceStatus)
const personnelBattalionChart = computed<ChartDataPoint[]>(() => personnelCharts.value.battalions)
const personnelCompanyChart = computed<ChartDataPoint[]>(() => personnelCharts.value.companies)
const personnelSexChart = computed<ChartDataPoint[]>(() => personnelCharts.value.sex)
const personnelTimelineChart = computed<ChartDataPoint[]>(() => personnelCharts.value.timeline)

const equipmentAssetStatusChart = computed<ChartDataPoint[]>(() => equipmentCharts.value.assetStatus)
const equipmentServiceabilityChart = computed<ChartDataPoint[]>(() => equipmentCharts.value.serviceability)
const equipmentItemsChart = computed<ChartDataPoint[]>(() => equipmentCharts.value.items)
const equipmentLocationChart = computed<ChartDataPoint[]>(() => equipmentCharts.value.locations)
const equipmentTimelineChart = computed<ChartDataPoint[]>(() => equipmentCharts.value.timeline)

const personnelMetrics = computed(() => [
  { label: 'Personnel Records', value: reportChartsResponse.value.personnel.metrics.totalRecords.toLocaleString(), description: 'Total personnel records available for this report.' },
  { label: 'Battalions Represented', value: reportChartsResponse.value.personnel.metrics.battalionsRepresented.toLocaleString(), description: 'Unique battalion assignments in the backend report data.' },
  { label: 'Companies Represented', value: reportChartsResponse.value.personnel.metrics.companiesRepresented.toLocaleString(), description: 'Unique company assignments in the backend report data.' },
])

const equipmentMetrics = computed(() => [
  { label: 'Equipment Assets', value: reportChartsResponse.value.equipment.metrics.totalAssets.toLocaleString(), description: 'Total equipment asset records available for this report.' },
  { label: 'Equipment Items', value: reportChartsResponse.value.equipment.metrics.totalItems.toLocaleString(), description: 'Total equipment item definitions available for chart grouping.' },
  { label: 'Tracked Locations', value: reportChartsResponse.value.equipment.metrics.trackedLocations.toLocaleString(), description: 'Unique current locations in the backend report data.' },
])

const activeMetrics = computed(() => activeTab.value === 'personnel' ? personnelMetrics.value : equipmentMetrics.value)

const {
  handlePrintReport,
} = useReportPrintHandler({
  activeTab,
  activeMetrics,
})
</script>
