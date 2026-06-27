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

      <div class="flex justify-end gap-2">
        <PrintDataListButton
          table-name="equipment_incidents"
          table-label="Equipment Incidents"
          :filters="filters"
          :disabled="isLoading"
          :get-print-data="handlePrintEquipmentIncidents"
        />

        <BaseButton v-if="canCreateEquipmentIncidents" @click="onOpenCreateEquipmentIncidentModal">
          Create Equipment Incident
        </BaseButton>
      </div>

      <BaseAlert v-if="error" :message="error" tone="danger" />

      <EquipmentIncidentsFilterComponent :model-value="filters" @apply="onApply" @reset="onReset" />
      <EquipmentIncidentsTableComponent
        :rows="tableRows"
        :is-loading="isLoading"
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total-items="pagination.totalItems"
        :page-size="pagination.pageSize"
        @action="onTableAction"
        @update:current-page="onPageChange"
        @update:page-size="onPageSizeChange"
      />

      <CreateEquipmentIncidentModal
        v-if="isCreateEquipmentIncidentModalOpen"
        :is-submitting="isCreating"
        :error-message="createError"
        @close="onCloseCreateEquipmentIncidentModal"
        @submit="onSubmitCreateEquipmentIncident"
      />

      <UpdateEquipmentIncidentDeploymentModal
        v-if="selectedIncident && activeUpdateSection === 'deployment'"
        :incident="selectedIncident"
        :is-submitting="isUpdating"
        :error-message="updateError"
        @close="closeUpdateModal"
        @submit="submitDeploymentUpdate"
      />

      <UpdateEquipmentIncidentDetailsModal
        v-if="selectedIncident && activeUpdateSection === 'details'"
        :incident="selectedIncident"
        :is-submitting="isUpdating"
        :error-message="updateError"
        @close="closeUpdateModal"
        @submit="submitDetailsUpdate"
      />

      <UpdateEquipmentIncidentEquipmentModal
        v-if="selectedIncident && activeUpdateSection === 'equipment'"
        :incident="selectedIncident"
        :is-submitting="isUpdating"
        :error-message="updateError"
        @close="closeUpdateModal"
        @submit="submitEquipmentUpdate"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import EquipmentIncidentsFilterComponent from '~/components/incidents/EquipmentIncidentsFilterComponent.vue'
import CreateEquipmentIncidentModal from '~/components/incidents/CreateEquipmentIncidentModal.vue'
import EquipmentIncidentsTableComponent from '~/components/incidents/EquipmentIncidentsTableComponent.vue'
import UpdateEquipmentIncidentDeploymentModal from '~/components/incidents/UpdateEquipmentIncidentDeploymentModal.vue'
import UpdateEquipmentIncidentDetailsModal from '~/components/incidents/UpdateEquipmentIncidentDetailsModal.vue'
import UpdateEquipmentIncidentEquipmentModal from '~/components/incidents/UpdateEquipmentIncidentEquipmentModal.vue'
import UpdateEquipmentIncidentPersonnelModal from '~/components/incidents/UpdateEquipmentIncidentPersonnelModal.vue'
import UpdateEquipmentIncidentLocationModal from '~/components/incidents/UpdateEquipmentIncidentLocationModal.vue'
import UpdateEquipmentIncidentStatusModal from '~/components/incidents/UpdateEquipmentIncidentStatusModal.vue'
import { useDialog } from '~/composables/useDialog'
import { useIncidents } from '~/composables/useIncidents'
import {
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
  EQUIPMENT_INCIDENTS_PAGE_REQUIRED_PERMISSIONS,
  EQUIPMENT_INCIDENTS_PAGE_SECTION_CLASSES,
  EQUIPMENT_INCIDENTS_PAGE_SUBTITLE,
  EQUIPMENT_INCIDENTS_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import {
  createCompleteListPrintHandler,
  createIncidentTableActionHandler,
  useCreateEquipmentIncidentHandler,
  useDeleteEquipmentIncidentHandler,
  useIncidentListHandlers,
  useIncidentSearchHandlers,
  usePrintIncidentsHandler,
  useUpdateEquipmentIncidentHandler,
  type IncidentUpdateSection,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { EquipmentIncidentTableRow } from '~/types/domain/incident'

const {
  filters,
  tableRows,
  kpis,
  pagination,
  isLoading,
  isCreating,
  isUpdating,
  error,
  createError,
  updateError,
  loadEquipmentIncidents,
  createEquipmentIncident,
  updateEquipmentIncidentDeployment,
  updateEquipmentIncidentDetails,
  updateEquipmentIncidentEquipment,
  updateEquipmentIncidentPersonnel,
  updateEquipmentIncidentLocation,
  updateEquipmentIncidentStatus,
  deleteEquipmentIncident,
} = useIncidents()

const authStore = useAuthStore()
const canCreateEquipmentIncidents = computed(() => authStore.hasPermissionAccess(EQUIPMENT_INCIDENTS_PAGE_REQUIRED_PERMISSIONS.create))
const isCreateEquipmentIncidentModalOpen = ref(false)
const selectedIncident = ref<EquipmentIncidentTableRow | null>(null)
const activeUpdateSection = ref<IncidentUpdateSection | null>(null)

const { showDialog } = useDialog()
const { handleFilterApply, handleFilterReset } = useIncidentSearchHandlers(filters)
const {
  onOpenCreateEquipmentIncidentModal,
  onCloseCreateEquipmentIncidentModal,
  onSubmitCreateEquipmentIncident,
} = useCreateEquipmentIncidentHandler({
  isCreateEquipmentIncidentModalOpen,
  createEquipmentIncident,
  showDialog,
  errorMessage: createError,
})
const {
  openUpdateModal,
  closeUpdateModal,
  submitDeploymentUpdate,
  submitDetailsUpdate,
  submitEquipmentUpdate,
  submitPersonnelUpdate,
  submitLocationUpdate,
  submitStatusUpdate,
} = useUpdateEquipmentIncidentHandler({
  selectedIncident,
  activeUpdateSection,
  updateError,
  showDialog,
  updateDeployment: updateEquipmentIncidentDeployment,
  updateDetails: updateEquipmentIncidentDetails,
  updateEquipment: updateEquipmentIncidentEquipment,
  updatePersonnel: updateEquipmentIncidentPersonnel,
  updateLocation: updateEquipmentIncidentLocation,
  updateStatus: updateEquipmentIncidentStatus,
})
const { onDeleteEquipmentIncident } = useDeleteEquipmentIncidentHandler({ deleteEquipmentIncident, showDialog })
const { printEquipmentIncidents } = usePrintIncidentsHandler()

const totalIncidentsKpi = computed(() => kpis.value.totalIncidents)
const unresolvedIncidentsKpi = computed(() => kpis.value.unresolvedIncidents)
const incidentsThisMonthKpi = computed(() => kpis.value.incidentsThisMonth)

const handlePrintEquipmentIncidents = createCompleteListPrintHandler<EquipmentIncidentTableRow>({
  rows: tableRows,
  pagination,
  loadPage: async (page, pageSize) => loadEquipmentIncidents(page, filters.value, pageSize),
  printItems: printEquipmentIncidents,
})

const { onApply, onReset, onPageChange, onPageSizeChange } = useIncidentListHandlers({
  filters,
  loadPage: loadEquipmentIncidents,
  handleFilterApply,
  handleFilterReset,
})

const onTableAction = createIncidentTableActionHandler<EquipmentIncidentTableRow>({
  'update-equipment-incident-deployment': (_id, row) => openUpdateModal('deployment', row),
  'update-equipment-incident-details': (_id, row) => openUpdateModal('details', row),
  'update-equipment-incident-equipment': (_id, row) => openUpdateModal('equipment', row),
  'update-equipment-incident-personnel': (_id, row) => openUpdateModal('personnel', row),
  'update-equipment-incident-location': (_id, row) => openUpdateModal('location', row),
  'update-equipment-incident-status': (_id, row) => openUpdateModal('status', row),
  'delete-equipment-incident': onDeleteEquipmentIncident,
})
</script>
