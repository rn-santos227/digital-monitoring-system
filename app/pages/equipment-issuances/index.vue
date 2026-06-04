<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
   <section :class="EQUIPMENT_ISSUANCES_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ EQUIPMENT_ISSUANCES_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_ISSUANCES_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          title="Total Equipment Issuances"
          subtitle="Tracked equipment issuance records."
          icon-name="arrow-path"
          tone="emerald"
          :value="totalEquipmentIssuancesKpi"
        />
      </div>

      <div v-if="canCreateEquipmentIssuances" class="flex justify-end">
        <BaseButton @click="onOpenCreateEquipmentIssuanceModal">Create Equipment Issuance</BaseButton>
      </div>

      <BaseAlert v-if="error" :message="error" tone="danger" />

      <EquipmentIssuancesFilter :model-value="filters" @apply="onApply" @reset="onReset" />

      <EquipmentIssuancesTable
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

      <CreateEquipmentIssuanceModal
        v-if="isCreateEquipmentIssuanceModalOpen"
        :is-submitting="isCreating"
        :error-message="createError"
        @close="onCloseCreateEquipmentIssuanceModal"
        @submit="onSubmitCreateEquipmentIssuance"
      />

      <UpdateEquipmentIssuanceModal
        v-if="isUpdateEquipmentIssuanceModalOpen && selectedEquipmentIssuance"
        :initial-values="selectedEquipmentIssuanceFormValues"
        :is-submitting="isUpdating"
        :error-message="updateError"
        @close="closeUpdateEquipmentIssuanceModal"
        @submit="onUpdateEquipmentIssuanceWithFeedback"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import CreateEquipmentIssuanceModal from '~/components/equipment/CreateEquipmentIssuanceModal.vue'
import UpdateEquipmentIssuanceModal from '~/components/equipment/UpdateEquipmentIssuanceModal.vue'
import ViewEquipmentIssuanceModal from '~/components/equipment/ViewEquipmentIssuanceModal.vue'
import EquipmentIssuancesFilter from '~/components/equipment/EquipmentIssuancesFilter.vue'
import EquipmentIssuancesTable from '~/components/equipment/EquipmentIssuancesTable.vue'
import { useEquipmentIssuances } from '~/composables/useEquipmentIssuances'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
  EQUIPMENT_ISSUANCES_PAGE_REQUIRED_PERMISSIONS,
  EQUIPMENT_ISSUANCES_PAGE_SECTION_CLASSES,
  EQUIPMENT_ISSUANCES_PAGE_SUBTITLE,
  EQUIPMENT_ISSUANCES_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import {
  useCreateEquipmentIssuanceHandler,
  useDeleteEquipmentIssuanceHandler,
  useEquipmentPageHandlers,
  useEquipmentSearchHandlers,
  useUpdateEquipmentIssuanceHandler,
  useViewEquipmentIssuanceHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type {
  EquipmentIssuanceListItem,
  EquipmentIssuanceSearchQuery,
  EquipmentIssuanceTableRow,
} from '~/types/domain/equipment'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'

const {
  filters,
  tableRows,
  pagination,
  isLoading,
  isCreating,
  isUpdating,
  isDeleting,
  error,
  createError,
  updateError,
  loadEquipmentIssuances,
  createEquipmentIssuance,
  getEquipmentIssuanceById,
  updateEquipmentIssuance,
  deleteEquipmentIssuance,
} = useEquipmentIssuances()

const authStore = useAuthStore()
const canCreateEquipmentIssuances = computed(() => authStore.hasPermissionAccess(EQUIPMENT_ISSUANCES_PAGE_REQUIRED_PERMISSIONS.issue))

const { showDialog } = useDialog()
const { handleFilterReset } = useEquipmentPageHandlers(filters)
const { handleFilterApply } = useEquipmentSearchHandlers(filters)

const totalEquipmentIssuancesKpi = computed(() => pagination.value.totalItems)
const isCreateEquipmentIssuanceModalOpen = ref(false)
const isViewEquipmentIssuanceModalOpen = ref(false)
const isUpdateEquipmentIssuanceModalOpen = ref(false)
const selectedViewEquipmentIssuance = ref<EquipmentIssuanceListItem | null>(null)
const selectedEquipmentIssuance = ref<EquipmentIssuanceListItem | null>(null)
const {
  onOpenCreateEquipmentIssuanceModal,
  onCloseCreateEquipmentIssuanceModal,
  onSubmitCreateEquipmentIssuance,
} = useCreateEquipmentIssuanceHandler({
  isCreateEquipmentIssuanceModalOpen,
  createEquipmentIssuance,
  showDialog,
  errorMessage: createError,
})

const {
  closeUpdateEquipmentIssuanceModal,
  onOpenUpdateEquipmentIssuanceModal,
  onUpdateEquipmentIssuance,
  selectedEquipmentIssuanceFormValues,
} = useUpdateEquipmentIssuanceHandler({
  isUpdateEquipmentIssuanceModalOpen,
  selectedEquipmentIssuance,
  getEquipmentIssuanceById,
  updateEquipmentIssuance,
  errorMessage: updateError,
})

const onUpdateEquipmentIssuanceWithFeedback = createModalFeedbackHandler(onUpdateEquipmentIssuance, showDialog, {
  successTitle: 'Equipment issuance updated',
  successMessage: 'Equipment issuance has been updated successfully.',
  errorTitle: 'Update failed',
  errorMessage: 'Unable to update equipment issuance right now.',
})

const { onDeleteEquipmentIssuance } = useDeleteEquipmentIssuanceHandler({
  deleteEquipmentIssuance,
  showDialog,
})

const { closeViewEquipmentIssuanceModal, onViewEquipmentIssuance } = useViewEquipmentIssuanceHandler({
  isViewEquipmentIssuanceModalOpen,
  selectedEquipmentIssuance: selectedViewEquipmentIssuance,
  getEquipmentIssuanceById,
})

const onApply = async (value: Partial<EquipmentIssuanceSearchQuery>) => {
  const result = handleFilterApply(value)

  if (!result.isValid) {
    return
  }

  await loadEquipmentIssuances(1, result.filters)
}

const onReset = async () => {
  const resetFilters = handleFilterReset()
  await loadEquipmentIssuances(1, resetFilters)
}

const onPageChange = async (page: number) => {
  await loadEquipmentIssuances(page, filters.value)
}

const onPageSizeChange = async (pageSize: number) => {
  await loadEquipmentIssuances(1, filters.value, pageSize)
}

const onTableAction = async ({ actionKey, row }: { actionKey: string; row: EquipmentIssuanceTableRow }) => {
  if (actionKey === 'view-equipment-issuance') {
    await onViewEquipmentIssuance(row.id)
    return
  }

  if (actionKey === 'edit-equipment-issuance') {
    await onOpenUpdateEquipmentIssuanceModal(row.id)
    return
  }

  if (actionKey === 'delete-equipment-issuance') {
    await onDeleteEquipmentIssuance(row.id)
  }
}
</script>
