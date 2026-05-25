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
          :loader="loadCategoryKpi"
        />

        <KpiCard
          title="Unused Categories"
          subtitle="Categories with no equipment items assigned."
          icon-name="archive"
          tone="amber"
          :loader="loadUnusedCategoryKpi"
        />
      </div>

      <BaseAlert
        v-if="error"
        :message="error"
        tone="danger"
      />

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
        @update:current-page="onPageChange"
        @update:page-size="onPageSizeChange"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import KpiCard from '~/components/general/KpiCard.vue'
import CreateEquipmentCategoryModal from '~/components/equipment/CreateEquipmentCategoryModal.vue'
import EquipmentCategoriesFilter from '~/components/equipment/EquipmentCategoriesFilter.vue'
import EquipmentCategoriesTable from '~/components/equipment/EquipmentCategoriesTable.vue'
import UpdateEquipmentCategoryModal from '~/components/equipment/UpdateEquipmentCategoryModal.vue'
import ViewEquipmentCategoryModal from '~/components/equipment/ViewEquipmentCategoryModal.vue'
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
  useCreateEquipmentCategoryHandler,
  useDeleteEquipmentCategoryHandler,
  useEquipmentCategoryPageHandlers,
  useUpdateEquipmentCategoryHandler,
  useViewEquipmentCategoryHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type {
  EquipmentCategoryDetailItem,
  EquipmentCategorySearchQuery,
  EquipmentCategoryTableRow,
} from '~/types/domain/equipment'

const {
  filters,
  tableRows,
  pagination,
  isLoading,
  error,
  loadEquipmentCategories,
  createEquipmentCategory,
  deleteEquipmentCategory,
  getEquipmentCategoryById,
  updateEquipmentCategory,
} = useEquipmentCategories()

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

const onApply = async (value: Partial<EquipmentCategorySearchQuery>) => {
  const next = handleFilterApply(value)
  await loadEquipmentCategories(1, next)
}

const onReset = async () => {
  const next = handleFilterReset()
  await loadEquipmentCategories(1, next)
}

const onPageChange = async (page: number) => {
  await loadEquipmentCategories(page)
}

const onPageSizeChange = async (pageSize: number) => {
  await loadEquipmentCategories(1, filters.value, pageSize)
}

const onTableAction = async (payload: { actionKey: string; row: EquipmentCategoryTableRow }) => {
  const equipmentCategoryId = String(payload.row.id ?? '')


  if (!equipmentCategoryId) {
    return
  }

  if (payload.actionKey === 'view-equipment-category') {
    await onViewEquipmentCategory(equipmentCategoryId)
    return
  }

  if (payload.actionKey === 'edit-equipment-category') {
    await onOpenUpdateEquipmentCategoryModal(equipmentCategoryId)
    return
  }

  if (payload.actionKey === 'delete-equipment-category') {
    await onDeleteEquipmentCategory(equipmentCategoryId)
  }
}

const loadUnusedCategoryKpi = async (): Promise<KpiCardLoaderResult> => {
  await loadEquipmentCategories(1, filters.value, pagination.value.pageSize)

  const unusedCategoryCount = tableRows.value.filter((row) => (row.itemCount ?? 0) === 0).length

  return {
    value: unusedCategoryCount.toLocaleString(),
  }
}
</script>
