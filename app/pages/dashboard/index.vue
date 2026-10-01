<template>

</template>

<script setup lang="ts">
import DashboardAdvancedParameters from '~/components/dashboard/DashboardAdvancedParameters.vue'
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
import {
  DASHBOARD_PAGE_SECTION_CLASSES,
  DASHBOARD_PAGE_SUBTITLE,
  DASHBOARD_PAGE_TITLE,
  INITIAL_DASHBOARD_PARAMETERS,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'
import {
  createDashboardParameterHandlers,
  createInitialDashboardData,
} from '~/handlers/dashboard'
import type { DashboardParameters } from '~/types/domain/dashboard'

const parameters = ref<DashboardParameters>({ ...INITIAL_DASHBOARD_PARAMETERS })
const dashboardData = ref(createInitialDashboardData())
const {
  applyParameters,
  initializeParameters,
} = createDashboardParameterHandlers(parameters, dashboardData)

const topKpis = computed(() => dashboardData.value.topKpis)
const personnelDeploymentSummary = computed(() => dashboardData.value.personnelDeploymentSummary)
const equipmentStatusOverview = computed(() => dashboardData.value.equipmentStatusOverview)
const criticalPersonnel = computed(() => dashboardData.value.criticalPersonnel)
const criticalEquipment = computed(() => dashboardData.value.criticalEquipment)
const nearRotation = computed(() => dashboardData.value.nearRotation)
const locationLoadAnalysis = computed(() => dashboardData.value.locationLoadAnalysis)

</script>
