<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="PERSONNEL_PAGE_SECTION_CLASSES">
      <header :class="PERSONNEL_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ PERSONNEL_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ PERSONNEL_PAGE_SUBTITLE }}</p>
      </header>

      <BaseAlert
        v-if="!canViewPersonnel"
        message="You do not have permission to view personnel records."
        tone="warning"
      />

      <template v-else>
        <PersonnelFilter
          :model-value="filters"
          :validation-errors="filterValidationErrors"
          @apply="handleApplyFilters"
          @reset="handleResetFilters"
        />

        <BaseAlert
          v-if="error"
          :message="error"
          tone="danger"
        />

        <DataTable
          :title="PERSONNEL_TABLE_TITLE"
          :columns="PERSONNEL_TABLE_COLUMNS"
          :rows="tableRows"
          row-key="id"
          :show-search="false"
          :empty-message="PERSONNEL_TABLE_EMPTY_MESSAGE"
          :is-loading="isLoading"
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          @update:current-page="handlePageChange"
        >
          <template #cell-fullName="{ row }">
            <div class="flex items-center gap-3">
              <BaseImage :alt="row.avatarAlt" :fallback-text="row.avatarAlt" size="sm" />
              <span>{{ row.fullName }}</span>
            </div>
          </template>

          <template #cell-serviceStatus="{ row }">
            <BaseChip :tone="row.serviceStatus === 'Active' ? 'success' : 'warning'">
              {{ row.serviceStatus }}
            </BaseChip>
          </template>
        </DataTable>
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PersonnelFilter from '~/components/personnel/PersonnelFilter.vue'
import {
  PERSONNEL_PAGE_REQUIRED_PERMISSIONS,
  PERSONNEL_PAGE_SECTION_CLASSES,
  PERSONNEL_PAGE_SUBTITLE,
  PERSONNEL_PAGE_TITLE,
  PERSONNEL_TABLE_COLUMNS,
  PERSONNEL_TABLE_EMPTY_MESSAGE,
  PERSONNEL_TABLE_TITLE,
} from '~/constants/page.constants'
import { APP_MAIN_CONTENT_CLASSES, PERSONNEL_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import { usePersonnel } from '~/composables/usePersonnel'
import { usePersonnelPageHandlers } from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { PersonnelSearchQuery } from '~/types/domain/personnel'
import type { FieldValidationMap } from '~/utils/field-validation'
import { useToast } from '~/composables/useToast'

const { filters, tableRows, pagination, isLoading, error, loadPersonnel } = usePersonnel()
const { handleFilterApply, handleFilterReset } = usePersonnelPageHandlers(filters)
const authStore = useAuthStore()
const { addToast } = useToast()

const filterValidationErrors = ref<FieldValidationMap>({})

const canViewPersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.view)
})

watch(canViewPersonnel, (hasAccess) => {
  if (!hasAccess) {
    return
  }

  void loadPersonnel(1)
}, { immediate: true })

const handleApplyFilters = async (value: Partial<PersonnelSearchQuery>) => {
  const { filters: queryFilters, errors, isValid } = handleFilterApply(value)
  filterValidationErrors.value = errors

  if (!isValid) {
    addToast({
      title: 'Invalid filter input',
      message: 'Please correct the highlighted fields before applying filters.',
      variant: 'error',
    })
    return
  }

  await loadPersonnel(1, queryFilters)
}

const handleResetFilters = async () => {
  const queryFilters = handleFilterReset()
  filterValidationErrors.value = {}
  await loadPersonnel(1, queryFilters)
}

const handlePageChange = async (page: number) => {
  await loadPersonnel(page)
}
</script>
