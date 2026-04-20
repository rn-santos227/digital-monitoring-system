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

        <div v-if="canCreatePersonnel" :class="PERSONNEL_TABLE_ACTIONS_ROW_CLASSES">
          <BaseButton @click="openCreatePersonnelModal">
            {{ PERSONNEL_CREATE_BUTTON_LABEL }}
          </BaseButton>
        </div>

        <DataTable
          :title="PERSONNEL_TABLE_TITLE"
          :columns="PERSONNEL_TABLE_COLUMNS"
          :rows="tableRows"
          row-key="id"
          :actions="personnelTableActions"
          :action-button-count="personnelTableActions.length"
          :actions-column-label="PERSONNEL_TABLE_ACTIONS_COLUMN_LABEL"
          :show-search="false"
          :empty-message="PERSONNEL_TABLE_EMPTY_MESSAGE"
          :is-loading="isLoading"
          :current-page="pagination.page"
          :total-pages="pagination.totalPages"
          @update:current-page="handlePageChange"
          @action="handleTableAction"
        >
          <template #cell-fullName="{ row }">
            <NuxtLink :to="ROUTE_PATHS.personnelProfile(row.id)" class="text-emerald-700 hover:text-emerald-900 hover:underline">
              {{ row.fullName }}
            </NuxtLink>
          </template>

          <template #cell-serviceStatus="{ row }">
            <BaseChip :tone="row.serviceStatus === 'Active' ? 'success' : 'warning'">
              {{ row.serviceStatus }}
            </BaseChip>
          </template>
        </DataTable>
      </template>

      <CreatePersonnelModal
        v-if="isCreatePersonnelModalOpen"
        @close="closeCreatePersonnelModal"
        @submit="handleCreatePersonnel"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CreatePersonnelModal from '~/components/personnel/CreatePersonnelModal.vue'
import PersonnelFilter from '~/components/personnel/PersonnelFilter.vue'
import {
  PERSONNEL_CREATE_BUTTON_LABEL,
  PERSONNEL_PAGE_REQUIRED_PERMISSIONS,
  PERSONNEL_PAGE_SECTION_CLASSES,
  PERSONNEL_PAGE_SUBTITLE,
  PERSONNEL_PAGE_TITLE,
} from '~/constants/page.constants'
import {
  PERSONNEL_TABLE_ACTIONS,
  PERSONNEL_TABLE_ACTIONS_COLUMN_LABEL,
  PERSONNEL_TABLE_COLUMNS,
  PERSONNEL_TABLE_EMPTY_MESSAGE,
  PERSONNEL_TABLE_TITLE,
} from '~/constants/table.constants'
import { ROUTE_PATHS } from '~/constants/routes.constants'
import {
  APP_MAIN_CONTENT_CLASSES,
  PERSONNEL_PAGE_HEADER_CLASSES,
  PERSONNEL_TABLE_ACTIONS_ROW_CLASSES,
} from '~/constants/shared.constants'
import { usePersonnel } from '~/composables/usePersonnel'
import { useToast } from '~/composables/useToast'
import { useCreatePersonnelModalHandler, usePersonnelPageHandlers, useViewPersonnelProfileHandler } from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { CreatePersonnelPayload, PersonnelSearchQuery } from '~/types/domain/personnel'
import type { FieldValidationMap } from '~/utils/field-validation'

const { filters, tableRows, pagination, isLoading, error, loadPersonnel, createPersonnel } = usePersonnel()
const { handleFilterApply, handleFilterReset } = usePersonnelPageHandlers(filters)
const { handleViewPersonnelProfile } = useViewPersonnelProfileHandler()
const authStore = useAuthStore()
const { addToast } = useToast()

const filterValidationErrors = ref<FieldValidationMap>({})
const isCreatePersonnelModalOpen = ref(false)
const { openCreatePersonnelModal, closeCreatePersonnelModal } = useCreatePersonnelModalHandler(isCreatePersonnelModalOpen)

const canViewPersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.view)
})

const canCreatePersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.create)
})

const personnelTableActions = computed(() => {
  if (!canViewPersonnel.value) {
    return []
  }

  return PERSONNEL_TABLE_ACTIONS
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

const handleCreatePersonnel = async (payload: CreatePersonnelPayload) => {
  try {
    await createPersonnel(payload)
    closeCreatePersonnelModal()
    addToast({
      title: 'Personnel created',
      message: 'Personnel record has been created successfully.',
      variant: 'success',
    })
  } catch {
    addToast({
      title: 'Personnel creation failed',
      message: 'Unable to create personnel record right now.',
      variant: 'error',
    })
  }
}

const handleTableAction = async (payload: { actionKey: string; row: { id: string } }) => {
  if (payload.actionKey !== 'view-personnel-profile') {
    return
  }

  await handleViewPersonnelProfile(payload.row.id)
}
</script>
