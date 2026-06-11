<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="AUDIT_PAGE_SECTION_CLASSES">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold text-slate-900">{{ AUDIT_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ AUDIT_PAGE_SUBTITLE }}</p>
      </header>

      <AuditFilter
        :model-value="filters"
        :validation-errors="filterValidationErrors"
        @apply="handleApplyFilters"
        @reset="handleResetFilters"
      />

      <AuditTable
        :rows="tableRows"
        row-key="id"
        :search-query="searchQuery"
        :show-search="false"
        :empty-message="tableEmptyMessage || AUDIT_TABLE_EMPTY_MESSAGE"
        :is-loading="isLoading"
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="totalItems"
        :page-size="pageSize"
        @sort="handleSort"
        @update:search-query="handleSearch"
        @action="handleAction"
        @update:current-page="currentPage = $event"
        @update:page-size="onPageSizeChange"
      />

      <AuditModal
        v-if="isAuditModalOpen"
        :audit-log="selectedAuditLog"
        :is-loading="isDetailLoading"
        :error="detailError"
        @close="handleModalClose"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AuditFilter from '~/components/audit/AuditFilter.vue'
import AuditTable from '~/components/audit/AuditTable.vue'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  AUDIT_PAGE_SECTION_CLASSES,
  AUDIT_PAGE_SUBTITLE,
  AUDIT_PAGE_TITLE,
} from '~/constants/page.constants'
import {
  AUDIT_TABLE_EMPTY_MESSAGE,
} from '~/constants/table.constants'
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'
import {
  useAuditFilterListHandlers,
  useAuditTrailPageHandlers,
} from '~/handlers'
import { useAuditTrail } from '~/composables/useAuditTrail'
import { useDialog } from '~/composables/useDialog'

const {
  searchQuery,
  filters,
  sortKey,
  sortDirection,
  tableRows,
  tableEmptyMessage,
  currentPage,
  pageSize,
  totalItems,
  totalPages,
  isLoading,
  selectedAuditLog,
  isDetailLoading,
  detailError,
  loadAuditLogs,
  loadAuditLogById,
  clearSelectedAuditLog,
} = useAuditTrail()

const activeAuditLogId = ref('')
const isAuditModalOpen = ref(false)
const filterValidationErrors = ref<FieldValidationMap>({})
const { showDialog } = useDialog()

const { handleSearch, handleSort, handleAction, handleFilterApply, handleFilterReset, handleModalClose } = useAuditTrailPageHandlers(
  sortKey,
  sortDirection,
  searchQuery,
  activeAuditLogId,
  isAuditModalOpen
)

const {
  handleApplyFilters,
  handleResetFilters,
  onPageSizeChange,
} = useAuditFilterListHandlers({
  currentPage,
  filters,
  validationErrors: filterValidationErrors,
  loadAuditLogs,
  handleFilterApply,
  handleFilterReset,
  showDialog,
})

watch(activeAuditLogId, async (nextAuditLogId) => {
  if (!nextAuditLogId) {
    clearSelectedAuditLog()
    return
  }

  try {
    await loadAuditLogById(nextAuditLogId)
  } catch {
    // Error state is exposed from the store.
  }
})
</script>
