<template>

</template>

<script setup lang="ts">
import ReportBarChart from '~/components/charts/ReportBarChart.vue'
import ReportDonutChart from '~/components/charts/ReportDonutChart.vue'
import ReportLineChart from '~/components/charts/ReportLineChart.vue'
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
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'
import { printReportSections } from '~/handlers/reports'
import type { ReportTabId } from '~/types/domain/reports'
import { groupRecordsByMonth, limitChartData, groupRecordsByStringValue } from '~/utils/chart-data'
import { getEquipmentAssetsEndpoint, getEquipmentItemsEndpoint } from '~/utils/equipment-endpoints'
import { getPersonnelEndpoint } from '~/utils/personnel-endpoints'

const activeTab = ref<ReportTabId>('personnel')

const [personnelResponse, equipmentAssetsResponse, equipmentItemsResponse] = await Promise.all([
  getPersonnelEndpoint({ page: 1, pageSize: 500 }),
  getEquipmentAssetsEndpoint({ page: 1, pageSize: 500 }),
  getEquipmentItemsEndpoint({ page: 1, pageSize: 500 }),
])

const personnelItems = computed(() => personnelResponse.items)
const equipmentAssets = computed(() => equipmentAssetsResponse.items)
const equipmentItems = computed(() => equipmentItemsResponse.items)

const personnelServiceStatusChart = computed(() => groupRecordsByStringValue(personnelItems.value, (item) => item.serviceStatus))
const personnelBattalionChart = computed(() => limitChartData(groupRecordsByStringValue(personnelItems.value, (item) => item.battalionName), 5))
const personnelCompanyChart = computed(() => limitChartData(groupRecordsByStringValue(personnelItems.value, (item) => item.companyName), 5))
const personnelSexChart = computed(() => groupRecordsByStringValue(personnelItems.value, (item) => item.sex))
const personnelTimelineChart = computed(() => groupRecordsByMonth(personnelItems.value, (item) => item.createdAt))

const equipmentAssetStatusChart = computed(() => groupRecordsByStringValue(equipmentAssets.value, (item) => item.assetStatusName))
const equipmentServiceabilityChart = computed(() => groupRecordsByStringValue(equipmentAssets.value, (item) => item.serviceabilityStatusName))
const equipmentItemsChart = computed(() => limitChartData(groupRecordsByStringValue(equipmentAssets.value, (item) => item.equipmentItemName), 5))
const equipmentLocationChart = computed(() => limitChartData(groupRecordsByStringValue(equipmentAssets.value, (item) => item.currentLocation), 5))
const equipmentTimelineChart = computed(() => groupRecordsByMonth(equipmentAssets.value, (item) => item.procurementDate ?? item.createdAt))

const personnelMetrics = computed(() => [
  { label: 'Personnel Records', value: personnelResponse.totalItems.toLocaleString(), description: 'Total personnel records available for this report.' },
  { label: 'Battalions Represented', value: new Set(personnelItems.value.map((item) => item.battalionName).filter(Boolean)).size.toLocaleString(), description: 'Unique battalion assignments in the loaded report data.' },
  { label: 'Companies Represented', value: new Set(personnelItems.value.map((item) => item.companyName).filter(Boolean)).size.toLocaleString(), description: 'Unique company assignments in the loaded report data.' },
])

const equipmentMetrics = computed(() => [
  { label: 'Equipment Assets', value: equipmentAssetsResponse.totalItems.toLocaleString(), description: 'Total equipment asset records available for this report.' },
  { label: 'Equipment Items', value: equipmentItemsResponse.totalItems.toLocaleString(), description: 'Total equipment item definitions available for chart grouping.' },
  { label: 'Tracked Locations', value: new Set(equipmentAssets.value.map((item) => item.currentLocation).filter(Boolean)).size.toLocaleString(), description: 'Unique current locations in the loaded report data.' },
])

const activeMetrics = computed(() => activeTab.value === 'personnel' ? personnelMetrics.value : equipmentMetrics.value)

const handlePrintReport = (): void => {
  printReportSections(activeTab.value === 'personnel' ? REPORTS_PERSONNEL_TAB_TITLE : REPORTS_EQUIPMENT_TAB_TITLE, [
    {
      title: REPORTS_SUMMARY_CARD_TITLE,
      rows: activeMetrics.value,
    },
  ])
}
</script>
