<template>

</template>

<script setup lang="ts">
import { computed } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import EquipmentIncidentsFilterComponent from '~/components/incidents/EquipmentIncidentsFilterComponent.vue'
import EquipmentIncidentsTableComponent from '~/components/incidents/EquipmentIncidentsTableComponent.vue'
import { useDialog } from '~/composables/useDialog'
import { useIncidents } from '~/composables/useIncidents'
import {
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
  EQUIPMENT_INCIDENTS_PAGE_SECTION_CLASSES,
  EQUIPMENT_INCIDENTS_PAGE_SUBTITLE,
  EQUIPMENT_INCIDENTS_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import {
  createIncidentTableActionHandler,
  useDeleteEquipmentIncidentHandler,
  useIncidentListHandlers,
  useIncidentSearchHandlers,
} from '~/handlers'
import type { EquipmentIncidentTableRow } from '~/types/domain/incident'

const {
  filters,
  tableRows,
  kpis,
  pagination,
  isLoading,
  error,
  loadEquipmentIncidents,
  deleteEquipmentIncident,
} = useIncidents()

const { showDialog } = useDialog()
const { handleFilterApply, handleFilterReset } = useIncidentSearchHandlers(filters)
const { onDeleteEquipmentIncident } = useDeleteEquipmentIncidentHandler({ deleteEquipmentIncident, showDialog })

const totalIncidentsKpi = computed(() => kpis.value.totalIncidents)
const unresolvedIncidentsKpi = computed(() => kpis.value.unresolvedIncidents)
const incidentsThisMonthKpi = computed(() => kpis.value.incidentsThisMonth)
</script>
