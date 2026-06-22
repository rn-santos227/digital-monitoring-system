<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="EQUIPMENT_INCIDENTS_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ EQUIPMENT_INCIDENTS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_INCIDENTS_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES">
        <KpiCard title="Total Incidents" subtitle="All reported equipment incident records." icon-name="shield-exclamation" tone="emerald" :value="totalIncidentsKpi" />
        <KpiCard title="Unresolved Incidents" subtitle="Incidents still missing a final resolution." icon-name="clock" tone="amber" :value="unresolvedIncidentsKpi" />
        <KpiCard title="Incidents This Month" subtitle="Incidents recorded during the current month." icon-name="clipboard-document-list" tone="sky" :value="incidentsThisMonthKpi" />
      </div>

      <BaseAlert v-if="error" :message="error" tone="danger" />

      <EquipmentIncidentsFilterComponent :model-value="filters" @apply="onApply" @reset="onReset" />
    </section>
  </main>
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

const { onApply, onReset, onPageChange, onPageSizeChange } = useIncidentListHandlers({
  filters,
  loadPage: loadEquipmentIncidents,
  handleFilterApply,
  handleFilterReset,
})

const onTableAction = createIncidentTableActionHandler<EquipmentIncidentTableRow>({
  'delete-equipment-incident': onDeleteEquipmentIncident,
})
</script>
