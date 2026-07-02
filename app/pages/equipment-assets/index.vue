<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="EQUIPMENT_ASSETS_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ EQUIPMENT_ASSETS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_ASSETS_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          title="Total Equipment Assets"
          subtitle="Tracked equipment asset records."
          icon-name="archive"
          tone="emerald"
          :value="totalEquipmentAssetsKpi"
        />

        <KpiCard
          title="Issued Assets"
          subtitle="Assets currently issued to personnel or units."
          icon-name="check-circle"
          tone="sky"
          :value="issuedEquipmentAssetsKpi"
        />

        <KpiCard
          title="Not Issued Assets"
          subtitle="Assets currently not issued and available for assignment."
          icon-name="clock"
          tone="amber"
          :value="notIssuedEquipmentAssetsKpi"
        />
      </div>

      <div class="flex justify-end gap-2">
        <PrintDataListButton
          table-name="equipment_assets"
          table-label="Equipment Assets"
          :filters="filters"
          :disabled="isLoading"
          :get-print-data="handlePrintEquipmentAssets"
        />
        <BaseButton
          v-if="canCreateEquipmentAssets"
          @click="onOpenCreateEquipmentAssetModal"
        >
          Create Equipment Asset
        </BaseButton>
      </div>

      <BaseAlert v-if="error" :message="error" tone="danger" />

      <EquipmentAssetsFilter :model-value="filters" @apply="onApply" @reset="onReset" />
      <BaseViewToggle v-model="equipmentAssetViewMode" />

      <EquipmentAssetsTable
        v-if="equipmentAssetViewMode === 'table'"
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

      <EquipmentAssetCards
        v-else
        :rows="equipmentAssetCardRows"
        :is-loading="isLoading"
        :can-load-more="canLoadMoreCards"
        @load-more="onLoadMoreCards"
        @action="onTableAction"
      />

      <CreateEquipmentAssetModal
        v-if="isCreateEquipmentAssetModalOpen"
        @close="onCloseCreateEquipmentAssetModal"
        @submit="onCreateEquipmentAssetWithFeedback"
      />

      <UpdateEquipmentAssetModal
        v-if="isUpdateEquipmentAssetModalOpen && selectedEquipmentAsset"
        :initial-values="selectedEquipmentAssetFormValues"
        @close="closeUpdateEquipmentAssetModal"
        @submit="onUpdateEquipmentAsset"
      />

      <ViewEquipmentAssetModal
        v-if="isViewEquipmentAssetModalOpen && selectedEquipmentAsset"
        :asset="selectedEquipmentAsset"
        @close="closeViewEquipmentAssetModal"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import CreateEquipmentAssetModal from '~/components/equipment/CreateEquipmentAssetModal.vue'
import EquipmentAssetsFilter from '~/components/equipment/EquipmentAssetsFilter.vue'
import EquipmentAssetCards from '~/components/equipment/EquipmentAssetCards.vue'
import EquipmentAssetsTable from '~/components/equipment/EquipmentAssetsTable.vue'
import BaseViewToggle from '~/components/ui/BaseViewToggle.vue'
import UpdateEquipmentAssetModal from '~/components/equipment/UpdateEquipmentAssetModal.vue'
import ViewEquipmentAssetModal from '~/components/equipment/ViewEquipmentAssetModal.vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import { useEquipmentAssets } from '~/composables/useEquipmentAssets'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_ASSETS_PAGE_REQUIRED_PERMISSIONS,
  EQUIPMENT_ASSETS_PAGE_SECTION_CLASSES,
  EQUIPMENT_ASSETS_PAGE_SUBTITLE,
  EQUIPMENT_ASSETS_PAGE_TITLE,
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import {
  createEquipmentTableActionHandler,
  createCompleteListPrintHandler,
  useCreateEquipmentAssetHandler,
  useDeleteEquipmentAssetHandler,
  useEquipmentListHandlers,
  useEquipmentSearchHandlers,
  useUpdateEquipmentAssetHandler,
  useViewEquipmentAssetHandler,
  usePrintEquipmentHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type {
  EquipmentAssetListItem,
  EquipmentAssetTableRow,
} from '~/types/domain/equipment'
import type { ListViewMode } from '~/constants/ui.constants'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'

const { printEquipmentAssets } = usePrintEquipmentHandler()

const {
  filters,
  tableRows,
  kpis,
  pagination,
  isLoading,
  error,
  loadEquipmentAssets,
  createEquipmentAsset,
  getEquipmentAssetById,
  updateEquipmentAsset,
  deleteEquipmentAsset,
} = useEquipmentAssets()

const equipmentAssetCardRows = ref<typeof tableRows.value>([])
const equipmentAssetViewMode = ref<ListViewMode>('table')

watch(tableRows, (rows) => {
  if (pagination.value.page === 1) {
    equipmentAssetCardRows.value = [...rows]
  }
}, { immediate: true })

const canLoadMoreCards = computed(() => pagination.value.page < pagination.value.totalPages)

const onLoadMoreCards = async () => {
  if (isLoading.value || !canLoadMoreCards.value) {
    return
  }

  await loadEquipmentAssets(pagination.value.page + 1, filters.value, pagination.value.pageSize)
  equipmentAssetCardRows.value = [...equipmentAssetCardRows.value, ...tableRows.value]
}

const authStore = useAuthStore()
const canCreateEquipmentAssets = computed(() => authStore.hasPermissionAccess(EQUIPMENT_ASSETS_PAGE_REQUIRED_PERMISSIONS.create))
const handlePrintEquipmentAssets = createCompleteListPrintHandler({
  rows: tableRows,
  pagination,
  loadPage: (page, pageSize) => loadEquipmentAssets(page, filters.value, pageSize),
  printItems: printEquipmentAssets,
})

const { showDialog } = useDialog()
const { handleFilterApply, handleFilterReset } = useEquipmentSearchHandlers(filters)

const isCreateEquipmentAssetModalOpen = ref(false)
const isUpdateEquipmentAssetModalOpen = ref(false)
const isViewEquipmentAssetModalOpen = ref(false)
const selectedEquipmentAsset = ref<EquipmentAssetListItem | null>(null)

const {
  onOpenCreateEquipmentAssetModal,
  onCloseCreateEquipmentAssetModal,
  onCreateEquipmentAsset,
} = useCreateEquipmentAssetHandler({
  isCreateEquipmentAssetModalOpen,
  createEquipmentAsset,
})

const onCreateEquipmentAssetWithFeedback = createModalFeedbackHandler(onCreateEquipmentAsset, showDialog, {
  successTitle: 'Equipment asset created',
  successMessage: 'Equipment asset has been created successfully.',
  errorTitle: 'Create failed',
  errorMessage: 'Unable to create equipment asset right now.',
})

const {
  closeUpdateEquipmentAssetModal,
  onOpenUpdateEquipmentAssetModal,
  onUpdateEquipmentAsset,
  selectedEquipmentAssetFormValues,
} = useUpdateEquipmentAssetHandler({
  isUpdateEquipmentAssetModalOpen,
  selectedEquipmentAsset,
  getEquipmentAssetById,
  updateEquipmentAsset,
})

const {
  closeViewEquipmentAssetModal,
  onViewEquipmentAsset,
} = useViewEquipmentAssetHandler({
  isViewEquipmentAssetModalOpen,
  selectedEquipmentAsset,
  getEquipmentAssetById,
})

const { onDeleteEquipmentAsset } = useDeleteEquipmentAssetHandler({
  deleteEquipmentAsset,
  showDialog,
})

const totalEquipmentAssetsKpi = computed(() => kpis.value.totalAssets)
const issuedEquipmentAssetsKpi = computed(() => kpis.value.issuedAssets)
const notIssuedEquipmentAssetsKpi = computed(() => kpis.value.notIssuedAssets)

const {
  onApply,
  onReset,
  onPageChange,
  onPageSizeChange,
} = useEquipmentListHandlers({
  filters,
  loadPage: loadEquipmentAssets,
  handleFilterApply,
  handleFilterReset,
})

const onTableAction = createEquipmentTableActionHandler<EquipmentAssetTableRow>({
  'view-equipment-asset': onViewEquipmentAsset,
  'edit-equipment-asset': onOpenUpdateEquipmentAssetModal,
  'delete-equipment-asset': onDeleteEquipmentAsset,
})
</script>
