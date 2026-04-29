<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="DASHBOARD_PAGE_SECTION_CLASSES">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold text-slate-900">{{ DASHBOARD_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ DASHBOARD_PAGE_SUBTITLE }}</p>
        <ClockDateWidget />
      </header>
      <DashboardTopKpisWidget :data="topKpis" />

      <section class="grid gap-4 xl:grid-cols-3">
        <DashboardPersonnelDeploymentSummaryWidget :data="personnelDeploymentSummary" />
        <DashboardEquipmentStatusOverviewWidget :data="equipmentStatusOverview" />
        <DashboardCriticalPersonnelWidget :data="criticalPersonnel" />
      </section>

      <section class="grid gap-4 xl:grid-cols-2">
        <DashboardCriticalEquipmentWidget :data="criticalEquipment" />
        <DashboardNearRotationWidget :data="nearRotation" />
      </section>

      <section class="grid gap-4 xl:grid-cols-2">
        <DashboardLocationLoadAnalysisWidget :data="locationLoadAnalysis" />
        <DashboardPersonnelDeploymentHistoryWidget :data="personnelDeploymentHistory" />
      </section>

      <DashboardOperationalTimeMonitoringWidget :data="operationalTimeMonitoring" />
    </section>
  </main>
</template>

<script setup lang="ts">
import DashboardCriticalEquipmentWidget from '~/components/dashboard/DashboardCriticalEquipmentWidget.vue'
import DashboardCriticalPersonnelWidget from '~/components/dashboard/DashboardCriticalPersonnelWidget.vue'
import DashboardEquipmentStatusOverviewWidget from '~/components/dashboard/DashboardEquipmentStatusOverviewWidget.vue'
import DashboardLocationLoadAnalysisWidget from '~/components/dashboard/DashboardLocationLoadAnalysisWidget.vue'
import DashboardNearRotationWidget from '~/components/dashboard/DashboardNearRotationWidget.vue'
import DashboardOperationalTimeMonitoringWidget from '~/components/dashboard/DashboardOperationalTimeMonitoringWidget.vue'
import DashboardPersonnelDeploymentHistoryWidget from '~/components/dashboard/DashboardPersonnelDeploymentHistoryWidget.vue'
import DashboardPersonnelDeploymentSummaryWidget from '~/components/dashboard/DashboardPersonnelDeploymentSummaryWidget.vue'
import DashboardTopKpisWidget from '~/components/dashboard/DashboardTopKpisWidget.vue'
import ClockDateWidget from '~/components/general/ClockDateWidget.vue'
import { DASHBOARD_PAGE_SECTION_CLASSES, DASHBOARD_PAGE_SUBTITLE, DASHBOARD_PAGE_TITLE } from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'
import {
  getDashboardCriticalEquipmentEndpoint,
  getDashboardCriticalPersonnelEndpoint,
  getDashboardEquipmentStatusOverviewEndpoint,
  getDashboardLocationLoadAnalysisEndpoint,
  getDashboardNearRotationEndpoint,
  getDashboardOperationalTimeMonitoringEndpoint,
  getDashboardPersonnelDeploymentHistoryEndpoint,
  getDashboardPersonnelDeploymentSummaryEndpoint,
  getDashboardTopKpisEndpoint,
} from '~/utils/dashboard-endpoints'

const [
  topKpis,
  personnelDeploymentSummary,
  equipmentStatusOverview,
  criticalPersonnel,
  criticalEquipment,
  nearRotation,
  locationLoadAnalysis,
  personnelDeploymentHistory,
  operationalTimeMonitoring,
] = await Promise.all([
  getDashboardTopKpisEndpoint(),
  getDashboardPersonnelDeploymentSummaryEndpoint(),
  getDashboardEquipmentStatusOverviewEndpoint(),
  getDashboardCriticalPersonnelEndpoint(),
  getDashboardCriticalEquipmentEndpoint(),
  getDashboardNearRotationEndpoint(),
  getDashboardLocationLoadAnalysisEndpoint(),
  getDashboardPersonnelDeploymentHistoryEndpoint(),
  getDashboardOperationalTimeMonitoringEndpoint(),
])
</script>
