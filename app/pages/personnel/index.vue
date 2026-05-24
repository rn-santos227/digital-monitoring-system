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
        <div :class="PERSONNEL_PAGE_KPI_GRID_CLASSES">
          <KpiCard
            title="Total Personnel"
            subtitle="Total personnel records currently tracked."
            icon-name="users"
            tone="emerald"
            :value="totalPersonnelCount"
            context="Personnel records in the current registry."
            :loader="loadTotalPersonnel"
          />
          <KpiCard
            title="Deployed Personnel"
            subtitle="Personnel currently tagged with deployed service status."
            icon-name="shield"
            tone="sky"
            :value="deployedPersonnelCount"
            context="Based on the loaded personnel page."
            :loader="loadDeployedPersonnel"
          />
          <KpiCard
            title="Total Ranks"
            subtitle="All rank records available for assignment."
            icon-name="clipboard-document-list"
            tone="violet"
            :value="totalRanksCount"
            context="Ranks available in rank management."
            :loader="loadTotalRanks"
          />
          <KpiCard
            title="Unused Ranks"
            subtitle="Rank records not currently used in loaded personnel rows."
            icon-name="archive"
            tone="amber"
            :value="unusedRanksCount"
            context="Computed from loaded personnel rows versus total ranks."
            :loader="loadUnusedRanks"
          />
        </div>

        <BaseTab
          :model-value="activeTab"
          :items="visibleTabItems"
          :aria-label="PERSONNEL_PAGE_TABS_ARIA_LABEL"
          @update:model-value="onTabChange"
        />

        <template v-if="activeTab === 'personnel-records'">
          <BaseAlert
            v-if="error"
            :message="error"
            tone="danger"
          />

          <div v-if="canCreatePersonnel" :class="PERSONNEL_TABLE_ACTIONS_ROW_CLASSES">
            <PrintDataListButton
              table-name="personnel"
              :table-label="PERSONNEL_PRINT_BUTTON_TABLE_LABEL"
              :filters="filters"
              :get-print-data="handlePrintPersonnel"
              :disabled="isLoading"
            />
            <BaseButton class="mx-2" variant="secondary" @click="isBatchUploadPersonnelModalOpen = true">
              {{ PERSONNEL_BATCH_UPLOAD_BUTTON_LABEL }}
            </BaseButton>
            <BaseButton @click="openCreatePersonnelModal">
              {{ PERSONNEL_CREATE_BUTTON_LABEL }}
            </BaseButton>
          </div>

          <PersonnelFilter
            :model-value="filters"
            :validation-errors="filterValidationErrors"
            @apply="handleApplyFilters"
            @reset="handleResetFilters"
          />

          <PersonnelTable
            :rows="tableRows"
            row-key="id"
            :is-loading="isLoading"
            :current-page="pagination.page"
            :total-pages="pagination.totalPages"
            :total-items="pagination.totalItems"
            :page-size="pagination.pageSize"
            :can-view-personnel="canViewPersonnel"
            :can-edit-personnel="canEditPersonnel"
            :can-delete-personnel="canDeletePersonnel"
            @update:current-page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            @action="handleTableAction"
          />
        </template>

        <template v-else>
          <div class="grid gap-3 md:grid-cols-[1fr_auto]">
            <BaseTextField
              :model-value="rankSearchTerm"
              type="search"
              label="Search Rank"
              placeholder="Search rank code or name"
              @update:model-value="onRankSearchTermChange"
            />
            <div v-if="canCreateRanks" class="flex items-end">
              <BaseButton @click="isCreateRankModalOpen = true">{{ RANK_CREATE_BUTTON_LABEL }}</BaseButton>
            </div>
          </div>
          <BaseAlert v-if="rankError" :message="rankError" tone="danger" />
          <RanksTable
            :rows="rankRows"
            :is-loading="isRanksLoading"
            :current-page="rankPagination.page"
            :total-pages="rankPagination.totalPages"
            :total-items="rankPagination.totalItems"
            :page-size="rankPagination.pageSize"
            :can-delete="canDeleteRanks"
            @update:current-page="onRankPageChange"
            @update:page-size="onRankPageSizeChange"
            @action="onRankTableAction"
          />
        </template>
      </template>

      <CreatePersonnelModal
        v-if="isCreatePersonnelModalOpen"
        @close="closeCreatePersonnelModal"
        @submit="handleCreatePersonnel"
      />

      <BatchUploadPersonnelModal
        v-if="isBatchUploadPersonnelModalOpen"
        :is-submitting="isBatchUploadSubmitting"
        :processed-count="batchProcessedCount"
        :total-count="batchTotalCount"
        @close="isBatchUploadPersonnelModalOpen = false"
        @submit="handleBatchUploadPersonnel"
      />

      <UpdatePersonnelModal
        v-if="isUpdatePersonnelModalOpen && selectedPersonnel"
        :initial-values="selectedPersonnel"
        @close="closeUpdatePersonnelModal"
        @submit="handleUpdatePersonnel"
      />

      <CreateRankModal
        v-if="isCreateRankModalOpen"
        @close="isCreateRankModalOpen = false"
        @submit="handleCreateRank"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import KpiCard, { type KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import BatchUploadPersonnelModal from '~/components/personnel/BatchUploadPersonnelModal.vue'
import CreateRankModal from '~/components/personnel/CreateRankModal.vue'
import CreatePersonnelModal from '~/components/personnel/CreatePersonnelModal.vue'
import PersonnelFilter from '~/components/personnel/PersonnelFilter.vue'
import PersonnelTable from '~/components/personnel/PersonnelTable.vue'
import RanksTable from '~/components/personnel/RanksTable.vue'
import UpdatePersonnelModal from '~/components/personnel/UpdatePersonnelModal.vue'
import { useRanks } from '~/composables/useRanks'
import {
  PERSONNEL_BATCH_UPLOAD_BUTTON_LABEL,
  PERSONNEL_CREATE_BUTTON_LABEL,
  PERSONNEL_PAGE_REQUIRED_PERMISSIONS,
  PERSONNEL_PAGE_SECTION_CLASSES,
  PERSONNEL_PAGE_SUBTITLE,
  PERSONNEL_PAGE_KPI_GRID_CLASSES,
  PERSONNEL_PAGE_TAB_ITEMS,
  PERSONNEL_PAGE_TAB_REQUIRED_PERMISSIONS,
  PERSONNEL_PAGE_TABS_ARIA_LABEL,
  PERSONNEL_PAGE_TITLE,
  PERSONNEL_PRINT_BUTTON_TABLE_LABEL,
  RANK_CREATE_BUTTON_LABEL,
} from '~/constants/page.constants'
import { RANK_PRIVILEGES } from '~/constants/privileges.constants'
import {
  APP_MAIN_CONTENT_CLASSES,
  PERSONNEL_PAGE_HEADER_CLASSES,
  PERSONNEL_TABLE_ACTIONS_ROW_CLASSES,
} from '~/constants/shared.constants'
import { useDialog } from '~/composables/useDialog'
import { useToast } from '~/composables/useToast'
import { usePersonnel } from '~/composables/usePersonnel'
import {
  useCreatePersonnelModalHandler,
  useDeletePersonnelHandler,
  useDeleteRankHandler,
  usePersonnelPageHandlers,
  usePrintPersonnelHandler,
  useRanksPageHandlers,
  useUpdatePersonnelHandler,
  useViewPersonnelProfileHandler,
} from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import { createModalFeedbackHandler } from '~/utils/modal-feedback'
import type { CreateRankPayload } from '~/types/domain/rank'
import type { PersonnelDetail, PersonnelSearchQuery, UpdatePersonnelPayload } from '~/types/domain/personnel'
import type { FieldValidationMap } from '~/utils/field-validation'

const { filters, tableRows, pagination, isLoading, error, loadPersonnel, createPersonnel, updatePersonnel, deletePersonnel, getPersonnelById, uploadPersonnelBatch } = usePersonnel()
const { tableRows: rankRows, pagination: rankPagination, isLoading: isRanksLoading, error: rankError, search: rankSearchTerm, loadRanks, createRank, deleteRank } = useRanks()
const { handleFilterApply, handleFilterReset } = usePersonnelPageHandlers(filters)
const { handleDownloadAndPrintPersonnel } = usePrintPersonnelHandler()
const { handleViewPersonnelProfile } = useViewPersonnelProfileHandler()
const authStore = useAuthStore()
const { showDialog } = useDialog()
const { addToast } = useToast()

const filterValidationErrors = ref<FieldValidationMap>({})
const isCreatePersonnelModalOpen = ref(false)
const isBatchUploadPersonnelModalOpen = ref(false)
const isBatchUploadSubmitting = ref(false)
const batchProcessedCount = ref(0)
const batchTotalCount = ref(0)
const isUpdatePersonnelModalOpen = ref(false)
const isCreateRankModalOpen = ref(false)
const selectedPersonnel = ref<PersonnelDetail | null>(null)
const activeTab = ref<'personnel-records' | 'rank-management'>('personnel-records')
const { openCreatePersonnelModal, closeCreatePersonnelModal } = useCreatePersonnelModalHandler(isCreatePersonnelModalOpen)
const createDeleteDialogCallbacks = (
  onRefresh: () => Promise<void>,
  successTitle: string,
  successMessage: string,
  cancelledMessage: string,
) => {
  return {
    onDeleteSuccess: async () => {
      await onRefresh()
      await showDialog({
        type: 'success',
        title: successTitle,
        message: successMessage,
        confirmLabel: 'OK',
      })
    },
    onDeleteCancelled: async () => {
      await showDialog({
        type: 'warning',
        title: 'Delete cancelled',
        message: cancelledMessage,
        confirmLabel: 'OK',
      })
    },
  }
}

const { onDeletePersonnel } = useDeletePersonnelHandler({
  showDialog,
  deletePersonnel,
  ...createDeleteDialogCallbacks(
    async () => {},
    'Personnel deleted',
    'Personnel record has been deleted successfully.',
    'Personnel deletion was cancelled.',
  ),
})
const { onDeleteRank } = useDeleteRankHandler({
  showDialog,
  deleteRank,
})
const visibleTabItems = computed(() => {
  return PERSONNEL_PAGE_TAB_ITEMS.filter((tabItem) => {
    const requiredPermissions = PERSONNEL_PAGE_TAB_REQUIRED_PERMISSIONS[tabItem.id as keyof typeof PERSONNEL_PAGE_TAB_REQUIRED_PERMISSIONS]
    return authStore.hasPermissionAccess(requiredPermissions)
  })
})

const canViewPersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.view)
})

const canCreatePersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.create)
})

const canEditPersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.edit)
})

const canDeletePersonnel = computed(() => {
  return authStore.hasPermissionAccess(PERSONNEL_PAGE_REQUIRED_PERMISSIONS.delete)
})

const canViewRanks = computed(() => {
  return authStore.hasPermissionAccess(RANK_PRIVILEGES.view)
})

const canCreateRanks = computed(() => {
  return authStore.hasPermissionAccess(RANK_PRIVILEGES.create)
})

const canDeleteRanks = computed(() => {
  return authStore.hasPermissionAccess(RANK_PRIVILEGES.delete)
})

const totalPersonnelCount = computed(() => pagination.value.totalItems)

const deployedPersonnelCount = computed(() => {
  return tableRows.value.reduce((count, row) => {
    const serviceStatus = row.serviceStatus.trim().toLowerCase()
    return serviceStatus.includes('deployed') ? count + 1 : count
  }, 0)
})

const totalRanksCount = computed(() => rankPagination.value.totalItems)

const unusedRanksCount = computed(() => {
  const usedRankNames = new Set(
    tableRows.value.map((row) => row.rankName.trim().toLowerCase()).filter((rankName) => rankName.length > 0),
  )
  return Math.max(0, rankPagination.value.totalItems - usedRankNames.size)
})

const loadTotalPersonnel = async (): Promise<KpiCardLoaderResult> => ({
  value: totalPersonnelCount.value,
  context: 'Personnel records in the current registry.',
})

const loadDeployedPersonnel = async (): Promise<KpiCardLoaderResult> => {
  return {
    value: deployedPersonnelCount.value,
    context: 'Based on the loaded personnel page.',
  }
}

const loadTotalRanks = async (): Promise<KpiCardLoaderResult> => ({
  value: totalRanksCount.value,
  context: 'Ranks available in rank management.',
})


const loadUnusedRanks = async (): Promise<KpiCardLoaderResult> => {
  return {
    value: unusedRanksCount.value,
    context: 'Computed from loaded personnel rows versus total ranks.',
  }
}

watch(canViewPersonnel, (hasAccess) => {
  if (!hasAccess) {
    return
  }

  void loadPersonnel(1)
}, { immediate: true })

watch(canViewRanks, (hasAccess) => {
  if (!hasAccess) {
    return
  }

  void loadRanks(1)
}, { immediate: true })

const { handleRankTabChange } = useRanksPageHandlers(activeTab)

const onTabChange = (nextTab: string) => {
  handleRankTabChange(nextTab)
}


const handleApplyFilters = async (value: Partial<PersonnelSearchQuery>) => {
  const { filters: queryFilters, errors, isValid } = handleFilterApply(value)
  filterValidationErrors.value = errors

  if (!isValid) {
    await showDialog({
      type: 'error',
      title: 'Invalid filter input',
      message: 'Please correct the highlighted fields before applying filters.',
      confirmLabel: 'OK',
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

const handlePrintPersonnel = async () => {
  return await handleDownloadAndPrintPersonnel(filters.value)
}

const handleCreatePersonnel = createModalFeedbackHandler(createPersonnel, showDialog, {
  successTitle: 'Personnel created',
  successMessage: 'Personnel record has been created successfully.',
  errorTitle: 'Personnel creation failed',
  errorMessage: 'Unable to create personnel record right now.',
}, closeCreatePersonnelModal)

const handleBatchUploadPersonnel = async (payload: { file: File, employmentStatusId: string, serviceStatusId: string }) => {
  isBatchUploadSubmitting.value = true
  batchProcessedCount.value = 0
  batchTotalCount.value = 0

  try {
    const response = await uploadPersonnelBatch(
      payload.file,
      payload.employmentStatusId,
      payload.serviceStatusId,
      (processedCount, totalCount) => {
        batchProcessedCount.value = processedCount
        batchTotalCount.value = totalCount
      },
    )

    isBatchUploadPersonnelModalOpen.value = false
    await showDialog({
      type: 'success',
      title: 'Batch upload complete',
      message: `${response.insertedCount} of ${response.totalCount} personnel records were inserted successfully.`,
      confirmLabel: 'Close',
      cancelLabel: 'Dismiss',
    })
  } catch {
    await showDialog({
      type: 'error',
      title: 'Personnel batch upload failed',
      message: 'Unable to upload personnel batch right now.',
      confirmLabel: 'OK',
    })
  } finally {
    isBatchUploadSubmitting.value = false
  }
}

const { closeUpdatePersonnelModal, onEditPersonnelAction, onUpdatePersonnel } = useUpdatePersonnelHandler({
  selectedPersonnel,
  isUpdatePersonnelModalOpen,
  getPersonnelById,
  updatePersonnel,
  showDialog,
  addToast,
})

const handleUpdatePersonnel = async (payload: UpdatePersonnelPayload) => {
  await onUpdatePersonnel(payload)
}

const handleTableAction = async (payload: { actionKey: string; row: { id: string } }) => {
  if (payload.actionKey === 'view-personnel-profile') {
    await handleViewPersonnelProfile(payload.row.id)
    return
  }

  if (payload.actionKey === 'edit-personnel') {
    await onEditPersonnelAction(payload.row.id)
    return
  }

  if (payload.actionKey === 'delete-personnel') {
    await onDeletePersonnel(payload.row.id)
  }
}

const onRankSearchTermChange = async (value: string | number) => {
  const searchTerm = String(value ?? '')
  await loadRanks(1, searchTerm)
}

const onRankPageChange = async (page: number) => {
  await loadRanks(page, rankSearchTerm.value)
}

const handlePageSizeChange = async (nextPageSize: number) => {
  await loadPersonnel(1, filters.value, nextPageSize)
}

const onRankPageSizeChange = async (nextPageSize: number) => {
  await loadRanks(1, rankSearchTerm.value, nextPageSize)
}

const handleCreateRank = createModalFeedbackHandler(async (payload: CreateRankPayload) => {
  await createRank(payload)
}, showDialog, {
  successTitle: 'Rank created',
  successMessage: 'Rank record has been created successfully.',
  errorTitle: 'Rank creation failed',
  errorMessage: 'Unable to create rank record right now.',
}, () => {
  isCreateRankModalOpen.value = false
})

const onRankTableAction = async (payload: { actionKey: string; row: { id: string } }) => {
  if (payload.actionKey !== 'delete-rank') {
    return
  }
  await onDeleteRank(payload.row.id)
}
</script>
