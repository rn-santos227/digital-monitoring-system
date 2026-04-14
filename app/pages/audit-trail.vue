<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <section :class="AUDIT_PAGE_SECTION_CLASSES">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold text-slate-900">{{ AUDIT_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ AUDIT_PAGE_SUBTITLE }}</p>
      </header>

      <DataTable
        :title="AUDIT_TABLE_TITLE"
        :columns="AUDIT_TABLE_COLUMNS"
        :rows="tableRows"
        :actions="AUDIT_TABLE_ACTIONS"
        row-key="id"
        :search-query="searchQuery"
        :search-placeholder="AUDIT_TABLE_SEARCH_PLACEHOLDER"
        :empty-message="tableEmptyMessage || AUDIT_TABLE_EMPTY_MESSAGE"
        :is-loading="isLoading"
        :current-page="currentPage"
        :total-pages="totalPages"
        @sort="handleSort"
        @update:search-query="handleSearch"
        @action="handleAction"
        @update:current-page="currentPage = $event"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
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
  sortKey,
  sortDirection,
  tableRows,
  tableEmptyMessage,
  currentPage,
  totalPages,
  isLoading,
} = useAuditTrail()

const { handleSearch, handleSort, handleAction } = useAuditTrailPageHandlers(
  sortKey,
  sortDirection,
  searchQuery
)
</script>
