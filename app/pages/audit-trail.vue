<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <section :class="AUDIT_PAGE_SECTION_CLASSES">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold text-slate-900">{{ AUDIT_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ AUDIT_PAGE_SUBTITLE }}</p>
      </header>

      <AuditFilter
        :model-value="filters"
        @apply="handleApplyFilters"
        @reset="handleResetFilters"
      />

      <DataTable
        :title="AUDIT_TABLE_TITLE"
        :columns="AUDIT_TABLE_COLUMNS"
        :rows="tableRows"
        :actions="AUDIT_TABLE_ACTIONS"
        row-key="id"
        :search-query="searchQuery"
        :search-placeholder="AUDIT_TABLE_SEARCH_PLACEHOLDER"
        :show-search="false"
        :empty-message="tableEmptyMessage || AUDIT_TABLE_EMPTY_MESSAGE"
        :is-loading="isLoading"
        :current-page="currentPage"
        :total-pages="totalPages"
        @sort="handleSort"
        @update:search-query="handleSearch"
        @action="handleAction"
        @update:current-page="currentPage = $event"
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
import type { AuditLogSearchQuery } from '~/types/domain/audit'
import {
  AUDIT_PAGE_SECTION_CLASSES,
  AUDIT_PAGE_SUBTITLE,
  AUDIT_PAGE_TITLE,
  AUDIT_TABLE_COLUMNS,
  AUDIT_TABLE_ACTIONS,
  AUDIT_TABLE_EMPTY_MESSAGE,
  AUDIT_TABLE_SEARCH_PLACEHOLDER,
  AUDIT_TABLE_TITLE,
} from '~/constants/page.constants'
import { useAuditTrailPageHandlers } from '~/handlers'
import { useAuditTrail } from '~/composables/useAuditTrail'

const {
  searchQuery,
  filters,
  sortKey,
  sortDirection,
  tableRows,
  tableEmptyMessage,
  currentPage,
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

const { handleSearch, handleSort, handleAction, handleFilterApply, handleFilterReset, handleModalClose } = useAuditTrailPageHandlers(
  sortKey,
  sortDirection,
  searchQuery,
  activeAuditLogId,
  isAuditModalOpen
)

const handleApplyFilters = async (value: Partial<AuditLogSearchQuery>) => {
  const queryFilters = handleFilterApply(value)
  currentPage.value = 1
  await loadAuditLogs(1, queryFilters)
}

const handleResetFilters = async () => {
  const queryFilters = handleFilterReset()
  currentPage.value = 1
  await loadAuditLogs(1, queryFilters)
}

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
