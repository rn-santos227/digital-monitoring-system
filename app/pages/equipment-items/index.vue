<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="EQUIPMENT_ITEMS_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ EQUIPMENT_ITEMS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_ITEMS_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          title="Total Equipment Items"
          subtitle="Tracked equipment item records."
          icon-name="archive"
          tone="emerald"
          :value="totalEquipmentItemsKpi"
        />
      </div>

      <div class="flex justify-end gap-2">
        <PrintDataListButton
          table-name="equipment_items"
          table-label="Equipment Items"
          :filters="filters"
          :disabled="isLoading"
          :get-print-data="handlePrintEquipmentItems"
        />
        <BaseButton v-if="canCreateEquipmentItems" @click="onOpenCreateEquipmentItemModal">
          Create Equipment Item
        </BaseButton>
      </div>

      <BaseAlert v-if="error" :message="error" tone="danger" />

      <EquipmentItemsFilter :model-value="filters" @apply="onApply" @reset="onReset" />

      <EquipmentItemsTable
        :rows="tableRows"
        :is-loading="isLoading"
        :current-page="pagination.page"
        :total-pages="pagination.totalPages"
        :total-items="pagination.totalItems"
        :page-size="pagination.pageSize"
        v-model:selected-row-keys="selectedEquipmentItemIds"
        @action="onTableAction"
        @update:current-page="onPageChange"
        @update:page-size="onPageSizeChange"
        @bulk-delete="deleteSelectedEquipmentItems"
      />

      <CreateEquipmentItemModal
        v-if="isCreateEquipmentItemModalOpen"
        @close="onCloseCreateEquipmentItemModal"
        @submit="onCreateEquipmentItemWithFeedback"
      />

      <UpdateEquipmentItemModal
        v-if="isUpdateEquipmentItemModalOpen && selectedEquipmentItem"
        :initial-values="selectedEquipmentItemFormValues"
        @close="closeUpdateEquipmentItemModal"
        @submit="onUpdateEquipmentItem"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import CreateEquipmentItemModal from '~/components/equipment/CreateEquipmentItemModal.vue'
import BulkUpdateEquipmentItemsModal from '~/components/equipment/BulkUpdateEquipmentItemsModal.vue'
import EquipmentItemsFilter from '~/components/equipment/EquipmentItemsFilter.vue'
import EquipmentItemsTable from '~/components/equipment/EquipmentItemsTable.vue'
import UpdateEquipmentItemModal from '~/components/equipment/UpdateEquipmentItemModal.vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import { useEquipmentItems } from '~/composables/useEquipmentItems'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
  EQUIPMENT_ITEMS_PAGE_REQUIRED_PERMISSIONS,
  EQUIPMENT_ITEMS_PAGE_SECTION_CLASSES,
  EQUIPMENT_ITEMS_PAGE_SUBTITLE,
  EQUIPMENT_ITEMS_PAGE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import {
  createEquipmentTableActionHandler,
  useCreateEquipmentItemHandler,
  useDeleteEquipmentItemHandler,
  useBulkDeleteEquipmentItemsHandler,
  useBulkUpdateEquipmentHandler,
  useEquipmentListHandlers,
  useEquipmentSearchHandlers,
  useUpdateEquipmentItemHandler,
  usePrintEquipmentHandler,
  createCompleteListPrintHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type {
  EquipmentItemListItem,
  EquipmentItemTableRow,
} from '~/types/domain/equipment'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'

const {
  filters,
  tableRows,
  kpis,
  pagination,
  isLoading,
  error,
  loadEquipmentItems,
  createEquipmentItem,
  getEquipmentItemById,
  updateEquipmentItem,
  deleteEquipmentItem,
} = useEquipmentItems()

const { printEquipmentItems } = usePrintEquipmentHandler()
const handlePrintEquipmentItems = createCompleteListPrintHandler({
  rows: tableRows,
  pagination,
  loadPage: (page, pageSize) => loadEquipmentItems(page, filters.value, pageSize),
  printItems: printEquipmentItems,
})

const authStore = useAuthStore()
const router = useRouter()
const canCreateEquipmentItems = computed(() => authStore.hasPermissionAccess(EQUIPMENT_ITEMS_PAGE_REQUIRED_PERMISSIONS.create))

const { showDialog } = useDialog()
const { handleFilterApply, handleFilterReset } = useEquipmentSearchHandlers(filters)

const isCreateEquipmentItemModalOpen = ref(false)
const isUpdateEquipmentItemModalOpen = ref(false)
const selectedEquipmentItem = ref<EquipmentItemListItem | null>(null)
const selectedEquipmentItemIds = ref<string[]>([])
const isBulkUpdateEquipmentModalOpen = ref(false)
const bulkUpdateEquipmentError = ref('')

const {
  openBulkUpdateEquipmentModal,
  closeBulkUpdateEquipmentModal,
  updateSelectedEquipment,
} = useBulkUpdateEquipmentHandler({
  domain: 'equipment-items',
  label: 'equipment item',
  selectedIds: selectedEquipmentItemIds,
  isModalOpen: isBulkUpdateEquipmentModalOpen,
  errorMessage: bulkUpdateEquipmentError,
  reload: async () => {
    await loadEquipmentItems()
  },
  showDialog,
})

const { deleteSelectedEquipmentItems } = useBulkDeleteEquipmentItemsHandler({
  selectedIds: selectedEquipmentItemIds,
  reload: async () => {
    await loadEquipmentItems()
  },
  showDialog,
})

const {
  onOpenCreateEquipmentItemModal,
  onCloseCreateEquipmentItemModal,
  onCreateEquipmentItem,
} = useCreateEquipmentItemHandler({
  isCreateEquipmentItemModalOpen,
  createEquipmentItem,
})

const onCreateEquipmentItemWithFeedback = createModalFeedbackHandler(onCreateEquipmentItem, showDialog, {
  successTitle: 'Equipment item created',
  successMessage: 'Equipment item has been created successfully.',
  errorTitle: 'Create failed',
  errorMessage: 'Unable to create equipment item right now.',
})

const {
  closeUpdateEquipmentItemModal,
  onOpenUpdateEquipmentItemModal,
  onUpdateEquipmentItem,
  selectedEquipmentItemFormValues,
} = useUpdateEquipmentItemHandler({
  isUpdateEquipmentItemModalOpen,
  selectedEquipmentItem,
  getEquipmentItemById,
  updateEquipmentItem,
})

const { onDeleteEquipmentItem } = useDeleteEquipmentItemHandler({
  deleteEquipmentItem,
  showDialog,
})

const totalEquipmentItemsKpi = computed(() => kpis.value.totalItems)

const {
  onApply,
  onReset,
  onPageChange,
  onPageSizeChange,
} = useEquipmentListHandlers({
  filters,
  loadPage: loadEquipmentItems,
  handleFilterApply,
  handleFilterReset,
})

const onTableAction = createEquipmentTableActionHandler<EquipmentItemTableRow>({
  'view-equipment-item': equipmentItemId => router.push(`/equipment-items/${equipmentItemId}`),
  'edit-equipment-item': onOpenUpdateEquipmentItemModal,
  'delete-equipment-item': onDeleteEquipmentItem,
})
</script>
