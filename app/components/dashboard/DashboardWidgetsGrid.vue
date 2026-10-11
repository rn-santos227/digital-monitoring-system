<template>
  <BaseAlert v-if="!hasSelection" :message="DASHBOARD_DISPLAY_EMPTY_MESSAGE" tone="info" />
  <template v-else>
    <BaseAlert v-for="failure in failures" :key="failure.key" :message="failure.message" tone="danger" />
    <DashboardTopKpisWidget v-if="show('topKpis')" :data="data.topKpis" :selected-values="display.kpis" />
    <section v-if="hasGridWidgets" :class="DASHBOARD_WIDGET_GRID_CLASSES">
      <DashboardPersonnelDeploymentSummaryWidget v-if="show('personnelDeploymentSummary')" :data="data.personnelDeploymentSummary" :selected-values="display.personnelValues" />
      <DashboardEquipmentStatusOverviewWidget v-if="show('equipmentStatusOverview')" :data="data.equipmentStatusOverview" :selected-values="display.equipmentValues" />
      <DashboardCriticalPersonnelWidget v-if="show('criticalPersonnel')" :data="data.criticalPersonnel" />
      <DashboardCriticalEquipmentWidget v-if="show('criticalEquipment')" :data="data.criticalEquipment" />
      <DashboardNearRotationWidget v-if="show('nearRotation')" :data="data.nearRotation" />
      <DashboardLocationLoadAnalysisWidget v-if="show('locationLoadAnalysis')" :data="data.locationLoadAnalysis" />
      <DashboardPersonnelDeploymentHistoryWidget v-if="show('personnelDeploymentHistory')" :data="data.personnelDeploymentHistory" />
    </section>
    <DashboardOperationalTimeMonitoringWidget v-if="show('operationalTimeMonitoring')" :data="data.operationalTimeMonitoring" :selected-values="display.operationalValues" />
  </template>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DashboardTopKpisWidget from '~/components/dashboard/DashboardTopKpisWidget.vue'
import DashboardPersonnelDeploymentSummaryWidget from '~/components/dashboard/DashboardPersonnelDeploymentSummaryWidget.vue'
import DashboardEquipmentStatusOverviewWidget from '~/components/dashboard/DashboardEquipmentStatusOverviewWidget.vue'
import DashboardCriticalPersonnelWidget from '~/components/dashboard/DashboardCriticalPersonnelWidget.vue'
import DashboardCriticalEquipmentWidget from '~/components/dashboard/DashboardCriticalEquipmentWidget.vue'
import DashboardNearRotationWidget from '~/components/dashboard/DashboardNearRotationWidget.vue'
import DashboardLocationLoadAnalysisWidget from '~/components/dashboard/DashboardLocationLoadAnalysisWidget.vue'
import DashboardPersonnelDeploymentHistoryWidget from '~/components/dashboard/DashboardPersonnelDeploymentHistoryWidget.vue'
import DashboardOperationalTimeMonitoringWidget from '~/components/dashboard/DashboardOperationalTimeMonitoringWidget.vue'
import type { DashboardData, DashboardDisplaySettings, DashboardLoadResult, DashboardWidgetId } from '~/types/domain/dashboard'
import { DASHBOARD_DISPLAY_EMPTY_MESSAGE, DASHBOARD_WIDGET_OPTIONS } from '~/constants/page.constants'
import { DASHBOARD_WIDGET_GRID_CLASSES } from '~/constants/shared.constants'
import { isDashboardWidgetEnabled } from '~/utils/dashboard-display'

const props = defineProps<{ data: DashboardData; display: DashboardDisplaySettings; errors: DashboardLoadResult['errors'] }>()
const show = (key: DashboardWidgetId) => isDashboardWidgetEnabled(props.display, key) && !props.errors[key]
const hasSelection = computed(() => DASHBOARD_WIDGET_OPTIONS.some((item) => isDashboardWidgetEnabled(props.display, item.key)))
const hasGridWidgets = computed(() => DASHBOARD_WIDGET_OPTIONS.some((item) => item.key !== 'topKpis' && item.key !== 'operationalTimeMonitoring' && show(item.key)))
const failures = computed(() => DASHBOARD_WIDGET_OPTIONS.filter((item) => isDashboardWidgetEnabled(props.display, item.key) && props.errors[item.key])
  .map((item) => ({ key: item.key, message: `${item.label}: ${props.errors[item.key] ?? ''}` })))
</script>
