<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="EQUIPMENT_CATEGORIES_PAGE_SECTION_CLASSES">
      <header :class="UNITS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">
          {{ EQUIPMENT_CATEGORIES_PAGE_TITLE }}
        </h1>
        <p class="text-sm text-slate-600">{{ EQUIPMENT_CATEGORIES_PAGE_SUBTITLE }}</p>
      </header>

      <div :class="EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES">
        <KpiCard
          title="Total Equipment Categories"
          subtitle="Tracked category records in registry."
          icon-name="squares"
          tone="emerald"
          :value="totalEquipmentCategoriesKpi"
        />

        <KpiCard
          title="Unused Categories"
          subtitle="Categories with no equipment items assigned."
          icon-name="archive"
          tone="amber"
          :value="unusedEquipmentCategoriesKpi"
        />
      </div>

      <BaseAlert
        v-if="error"
        :message="error"
        tone="danger"
      />

      <div class="flex justify-end gap-2">
        <PrintDataListButton
          table-name="equipment_categories"
          table-label="Equipment Categories"
          :filters="filters"
          :disabled="isLoading"
          :get-print-data="handlePrintEquipmentCategories"
        />
        <BaseButton
          v-if="canManageEquipmentCategories"
          @click="onOpenCreateEquipmentCategoryModal"
        >
          Create Equipment Category
        </BaseButton>
      </div>

      <EquipmentCategoriesFilter
        :model-value="filters"
        @apply="onApply"
        @reset="onReset"
      />

      <EquipmentCategoriesTable
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

      <CreateEquipmentCategoryModal
        v-if="isCreateEquipmentCategoryModalOpen"
        @close="onCloseCreateEquipmentCategoryModal"
        @submit="onCreateEquipmentCategoryWithFeedback"
      />

      <UpdateEquipmentCategoryModal
        v-if="isUpdateEquipmentCategoryModalOpen && selectedEquipmentCategory"
        :initial-values="selectedEquipmentCategoryFormValues"
        @close="closeUpdateEquipmentCategoryModal"
        @submit="onUpdateEquipmentCategory"
      />

      <ViewEquipmentCategoryModal
        v-if="isViewEquipmentCategoryModalOpen && selectedEquipmentCategory"
        :category="selectedEquipmentCategory"
        @close="closeViewEquipmentCategoryModal"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import CreateEquipmentCategoryModal from '~/components/equipment/CreateEquipmentCategoryModal.vue'
import EquipmentCategoriesFilter from '~/components/equipment/EquipmentCategoriesFilter.vue'
import EquipmentCategoriesTable from '~/components/equipment/EquipmentCategoriesTable.vue'
import UpdateEquipmentCategoryModal from '~/components/equipment/UpdateEquipmentCategoryModal.vue'
import ViewEquipmentCategoryModal from '~/components/equipment/ViewEquipmentCategoryModal.vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import { useEquipmentCategories } from '~/composables/useEquipmentCategories'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_CATEGORIES_PAGE_KPI_GRID_CLASSES,
  EQUIPMENT_CATEGORIES_PAGE_SECTION_CLASSES,
  EQUIPMENT_CATEGORIES_PAGE_SUBTITLE,
  EQUIPMENT_CATEGORIES_PAGE_TITLE,
  EQUIPMENT_CATEGORIES_PAGE_REQUIRED_PERMISSIONS,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, UNITS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import {
  createEquipmentTableActionHandler,
  useCreateEquipmentCategoryHandler,
  useDeleteEquipmentCategoryHandler,
  useEquipmentCategoryPageHandlers,
  useEquipmentListHandlers,
  useUpdateEquipmentCategoryHandler,
  useViewEquipmentCategoryHandler,
  usePrintEquipmentHandler,
  createCompleteListPrintHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'
import type {
  EquipmentCategoryDetailItem,
  EquipmentCategoryTableRow,
} from '~/types/domain/equipment'

const {
  filters,
  tableRows,
  kpis,
  pagination,
  isLoading,
  error,
  loadEquipmentCategories,
  createEquipmentCategory,
  deleteEquipmentCategory,
  getEquipmentCategoryById,
  updateEquipmentCategory,
} = useEquipmentCategories()

const { printEquipmentCategories } = usePrintEquipmentHandler()
const handlePrintEquipmentCategories = createCompleteListPrintHandler({
  rows: tableRows,
  pagination,
  loadPage: (page, pageSize) => loadEquipmentCategories(page, filters.value, pageSize),
  printItems: printEquipmentCategories,
})

const authStore = useAuthStore()
const canManageEquipmentCategories = computed(() => authStore.hasPermissionAccess(EQUIPMENT_CATEGORIES_PAGE_REQUIRED_PERMISSIONS.create))
const { showDialog } = useDialog()

const { handleFilterApply, handleFilterReset } = useEquipmentCategoryPageHandlers(filters)

const isCreateEquipmentCategoryModalOpen = ref(false)
const isUpdateEquipmentCategoryModalOpen = ref(false)
const isViewEquipmentCategoryModalOpen = ref(false)
const selectedEquipmentCategory = ref<EquipmentCategoryDetailItem | null>(null)

const { onOpenCreateEquipmentCategoryModal, onCloseCreateEquipmentCategoryModal, onCreateEquipmentCategory } = useCreateEquipmentCategoryHandler({
  isCreateEquipmentCategoryModalOpen,
  createEquipmentCategory,
})

const onCreateEquipmentCategoryWithFeedback = createModalFeedbackHandler(onCreateEquipmentCategory, showDialog, {
  successTitle: 'Equipment category created',
  successMessage: 'Equipment category has been created successfully.',
  errorTitle: 'Create failed',
  errorMessage: 'Unable to create equipment category right now.',
})

const { closeUpdateEquipmentCategoryModal, onOpenUpdateEquipmentCategoryModal, onUpdateEquipmentCategory, selectedEquipmentCategoryFormValues } = useUpdateEquipmentCategoryHandler({
  isUpdateEquipmentCategoryModalOpen,
  selectedEquipmentCategory,
  getEquipmentCategoryById,
  updateEquipmentCategory,
})

const { closeViewEquipmentCategoryModal, onViewEquipmentCategory } = useViewEquipmentCategoryHandler({
  isViewEquipmentCategoryModalOpen,
  selectedEquipmentCategory,
  getEquipmentCategoryById,
})

const { onDeleteEquipmentCategory } = useDeleteEquipmentCategoryHandler({ deleteEquipmentCategory, showDialog })

const totalEquipmentCategoriesKpi = computed(() => kpis.value.totalCategories)
const unusedEquipmentCategoriesKpi = computed(() => kpis.value.unusedCategories)

const {
  onApply,
  onReset,
  onPageChange,
  onPageSizeChange,
} = useEquipmentListHandlers({
  filters,
  loadPage: loadEquipmentCategories,
  handleFilterApply,
  handleFilterReset,
})

const onTableAction = createEquipmentTableActionHandler<EquipmentCategoryTableRow>({
  'view-equipment-category': onViewEquipmentCategory,
  'edit-equipment-category': onOpenUpdateEquipmentCategoryModal,
  'delete-equipment-category': onDeleteEquipmentCategory,
})
</script>
