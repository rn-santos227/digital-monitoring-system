<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="ENGAGEMENT_RECORDS_PAGE_SECTION_CLASSES">
      <header :class="DEPLOYMENTS_PAGE_HEADER_CLASSES">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900">{{ ENGAGEMENT_RECORDS_PAGE_TITLE }}</h1>
          <p class="text-sm text-slate-600">{{ ENGAGEMENT_RECORDS_PAGE_SUBTITLE }}</p>
        </div>
      </header>

      <div class="grid gap-4 md:grid-cols-2">
        <KpiCard
          title="Total Engagements"
          subtitle="Engagement profiles available for operations."
          icon-name="shield"
          tone="sky"
          :loader="loadTotalEngagements"
        />
        <KpiCard
          title="Total Engagement Records"
          subtitle="Personnel engagement history records."
          icon-name="clipboard-document-list"
          tone="amber"
          :loader="loadTotalEngagementRecords"
        />
      </div>

      <BaseTab
        :model-value="activeTab"
        :items="visibleTabItems"
        :aria-label="ENGAGEMENT_RECORDS_PAGE_TABS_ARIA_LABEL"
        @update:model-value="handleTabChange"
      />

      <template v-if="activeTab === 'records'">
        <EngagementRecordsFilter
          :model-value="engagementRecordsFilters"
          :validation-errors="engagementRecordsFilterValidationErrors"
          @apply="onApplyEngagementRecordsFilter"
          @reset="onResetEngagementRecordsFilter"
        />
        <BaseAlert v-if="engagementRecordsError" :message="engagementRecordsError" tone="danger" />

        <EngagementRecordsTable
          :rows="engagementRecordRows"
          :is-loading="isEngagementRecordsLoading"
          :current-page="engagementRecordsPagination.page"
          :total-pages="engagementRecordsPagination.totalPages"
          :total-items="engagementRecordsPagination.totalItems"
          :page-size="engagementRecordsPagination.pageSize"
          @update:current-page="onEngagementRecordsPageChange"
          @update:page-size="onEngagementRecordsPageSizeChange"
        />
      </template>

      <template v-else>
        <div v-if="authStore.hasPermissionAccess(ENGAGEMENT_PRIVILEGES.create)" :class="TRAINING_TABLE_ACTIONS_ROW_CLASSES">
          <BaseButton @click="onOpenCreateEngagementModal">Create Engagement</BaseButton>
        </div>

        <EngagementsFilter
          :model-value="engagementsFilters"
          :validation-errors="engagementsFilterValidationErrors"
          @apply="onApplyEngagementsFilter"
          @reset="onResetEngagementsFilter"
        />

        <BaseAlert v-if="engagementsError" :message="engagementsError" tone="danger" />

        <EngagementsTable
          :rows="engagementRows"
          :is-loading="isEngagementsLoading"
          :current-page="engagementsPagination.page"
          :total-pages="engagementsPagination.totalPages"
          :total-items="engagementsPagination.totalItems"
          :page-size="engagementsPagination.pageSize"
          @update:current-page="onEngagementsPageChange"
          @update:page-size="onEngagementsPageSizeChange"
        />
      </template>
      <CreateEngagementModal
        v-if="isCreateEngagementModalOpen"
        :is-submitting="isEngagementsLoading"
        :error-message="createEngagementErrorMessage"
        @close="onCloseCreateEngagementModal"
        @submit="onSubmitCreateEngagement"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { KpiCardLoaderResult } from '~/components/general/KpiCard.vue'
import KpiCard from '~/components/general/KpiCard.vue'
import CreateEngagementModal from '~/components/engagements/CreateEngagementModal.vue'
import EngagementRecordsFilter from '~/components/engagements/EngagementRecordsFilter.vue'
import EngagementRecordsTable from '~/components/engagements/EngagementRecordsTable.vue'
import EngagementsFilter from '~/components/engagements/EngagementsFilter.vue'
import EngagementsTable from '~/components/engagements/EngagementsTable.vue'
import UpdateEngagementModal from '~/components/engagements/UpdateEngagementModal.vue'
import ViewEngagementModal from '~/components/engagements/ViewEngagementModal.vue'
import { useDialog } from '~/composables/useDialog'
import { useEngagements } from '~/composables/useEngagements'
import {
  useCreateEngagementHandler,
  useDeleteEngagementHandler,
  useEngagementManagementPageHandlers,
  useUpdateEngagementHandler,
  useViewEngagementHandler,
} from '~/handlers/engagements'
import { useAuthStore } from '~/stores/auth'
import { useEngagementsStore } from '~/stores/engagements'
import {
  ENGAGEMENT_RECORDS_PAGE_SECTION_CLASSES,
  ENGAGEMENT_RECORDS_PAGE_SUBTITLE,
  ENGAGEMENT_RECORDS_PAGE_TAB_ITEMS,
  ENGAGEMENT_RECORDS_PAGE_TAB_REQUIRED_PERMISSIONS,
  ENGAGEMENT_RECORDS_PAGE_TABS_ARIA_LABEL,
  ENGAGEMENT_RECORDS_PAGE_TITLE,
} from '~/constants/page.constants'
import { ENGAGEMENT_PRIVILEGES } from '~/constants/privileges.constants'
import { APP_MAIN_CONTENT_CLASSES, DEPLOYMENTS_PAGE_HEADER_CLASSES, TRAINING_TABLE_ACTIONS_ROW_CLASSES } from '~/constants/shared.constants'
import type { EngagementManagementListItem } from '~/types/domain/engagement'
import type { FieldValidationMap } from '~/utils/field-validation'

type EngagementRecordsTabId = 'records' | 'engagements'

const activeTab = ref<EngagementRecordsTabId>('engagements')
const hasLoadedPageData = ref(false)
const engagementsFilters = ref({})
const engagementRecordsFilters = ref({})
const engagementsFilterValidationErrors = ref<FieldValidationMap>({})
const engagementRecordsFilterValidationErrors = ref<FieldValidationMap>({})
const isCreateEngagementModalOpen = ref(false)
const isUpdateEngagementModalOpen = ref(false)
const isViewEngagementModalOpen = ref(false)
const createEngagementErrorMessage = ref('')
const updateEngagementErrorMessage = ref('')
const selectedEngagement = ref<EngagementManagementListItem | null>(null)
const engagementPersonnelRows = ref<Record<string, unknown>[]>([])

const authStore = useAuthStore()
const engagementsStore = useEngagementsStore()
const { showDialog } = useDialog()
const {
  createEngagement,
  deleteEngagement,
  updateEngagement,
  getEngagementById,
  getEngagementPersonnel,
} = useEngagements()

const visibleTabItems = computed(() => {
  return ENGAGEMENT_RECORDS_PAGE_TAB_ITEMS.filter((tab) => {
    const tabId = tab.id as EngagementRecordsTabId
    const requiredPermissions = ENGAGEMENT_RECORDS_PAGE_TAB_REQUIRED_PERMISSIONS[tabId]
    return authStore.hasPermissionAccess(requiredPermissions)
  })
})

const {
  handleEngagementFilterApply: handleEngagementsFilterApply,
  handleEngagementFilterReset: handleEngagementsFilterReset,
} = useEngagementManagementPageHandlers(engagementsFilters)

const {
  handleEngagementFilterApply: handleEngagementRecordsFilterApply,
  handleEngagementFilterReset: handleEngagementRecordsFilterReset,
} = useEngagementManagementPageHandlers(engagementRecordsFilters)

const engagementRows = computed(() => engagementsStore.engagements.items)
const engagementRecordRows = computed(() => engagementsStore.records.items)
const isEngagementsLoading = computed(() => engagementsStore.engagements.isLoading)
const isEngagementRecordsLoading = computed(() => engagementsStore.records.isLoading)
const engagementsError = computed(() => engagementsStore.engagements.error)
const engagementRecordsError = computed(() => engagementsStore.records.error)
const engagementsPagination = computed(() => engagementsStore.engagements.pagination)
const engagementRecordsPagination = computed(() => engagementsStore.records.pagination)
const totalEngagements = computed(() => engagementsPagination.value.totalItems)
const totalEngagementRecords = computed(() => engagementRecordsPagination.value.totalItems)

const updateFormValues = computed(() => ({
  engagementTitle: selectedEngagement.value?.engagementTitle ?? '',
  engagementTypeId: selectedEngagement.value?.engagementTypeId ?? '',
  levelId: selectedEngagement.value?.levelId ?? '',
  statusId: selectedEngagement.value?.statusId ?? '',
  startDate: selectedEngagement.value?.startDate ?? '',
  endDate: selectedEngagement.value?.endDate ?? '',
  defaultRemarks: selectedEngagement.value?.defaultRemarks ?? '',
}))

const loadEngagements = async (page = 1, pageSize?: number) => {
  await engagementsStore.fetchEngagements(page, engagementsFilters.value, pageSize)
}

const loadEngagementRecords = async (page = 1, pageSize?: number) => {
  await engagementsStore.fetchEngagementRecords(page, engagementRecordsFilters.value, pageSize)
}


const {
  onOpenCreateEngagementModal,
  onCloseCreateEngagementModal,
  onSubmitCreateEngagement,
} = useCreateEngagementHandler({
  isCreateEngagementModalOpen,
  createEngagement,
  showDialog,
  errorMessage: createEngagementErrorMessage,
})

const {
  onOpenUpdateEngagementModal,
  onCloseUpdateEngagementModal,
  onSubmitUpdateEngagement,
} = useUpdateEngagementHandler({
  selectedEngagement,
  isUpdateEngagementModalOpen,
  errorMessage: updateEngagementErrorMessage,
  updateEngagement,
  getEngagementById,
  showDialog,
})

const {
  onOpenViewEngagementModal,
  onCloseViewEngagementModal,
} = useViewEngagementHandler({
  selectedEngagement,
  engagementPersonnelRows,
  isViewEngagementModalOpen,
  getEngagementById,
  getEngagementPersonnel,
})

const { onDeleteEngagement } = useDeleteEngagementHandler({
  deleteEngagement,
  showDialog,
})

const onEngagementAction = async ({ actionKey, row }: { actionKey: string; row: Record<string, unknown> }) => {
  const id = String(row.id ?? '')

  if (!id) {
    return
  }

  if (actionKey === 'view-engagement') {
    await onOpenViewEngagementModal(id)
    return
  }

  if (actionKey === 'edit-engagement') {
    await onOpenUpdateEngagementModal(id)
    return
  }

  if (actionKey === 'delete-engagement') {
    await onDeleteEngagement(id)
  }
}

watch(visibleTabItems, (tabs) => {
  const firstTabId = tabs[0]?.id
  if (!firstTabId) {
    return
  }

  if (!tabs.some(tab => tab.id === activeTab.value)) {
    activeTab.value = firstTabId as EngagementRecordsTabId
  }
}, { immediate: true })

watch(visibleTabItems, async (tabs) => {
  if (hasLoadedPageData.value) {
    return
  }

  const hasEngagementsTab = tabs.some(tab => tab.id === 'engagements')
  const hasRecordsTab = tabs.some(tab => tab.id === 'records')

  const loadTasks: Array<Promise<void>> = []

  if (hasEngagementsTab) {
    loadTasks.push(loadEngagements())
  }

  if (hasRecordsTab) {
    loadTasks.push(loadEngagementRecords())
  }

  await Promise.all(loadTasks)
  hasLoadedPageData.value = true
}, { immediate: true })

const loadTotalEngagements = async (): Promise<KpiCardLoaderResult> => ({ value: totalEngagements.value })
const loadTotalEngagementRecords = async (): Promise<KpiCardLoaderResult> => ({ value: totalEngagementRecords.value })


const handleTabChange = (tabId: string) => {
  activeTab.value = tabId as EngagementRecordsTabId
}

const onApplyEngagementsFilter = async () => {
  const result = handleEngagementsFilterApply(engagementsFilters.value)
  engagementsFilterValidationErrors.value = result.errors
  if (!result.isValid) {
    return
  }

  await loadEngagements(1)
}

const onResetEngagementsFilter = async () => {
  handleEngagementsFilterReset()
  engagementsFilterValidationErrors.value = {}
  await loadEngagements(1)
}

const onApplyEngagementRecordsFilter = async () => {
  const result = handleEngagementRecordsFilterApply(engagementRecordsFilters.value)
  engagementRecordsFilterValidationErrors.value = result.errors

  if (!result.isValid) {
    return
  }

  await loadEngagementRecords(1)
}

const onResetEngagementRecordsFilter = async () => {
  handleEngagementRecordsFilterReset()
  engagementRecordsFilterValidationErrors.value = {}
  await loadEngagementRecords(1)
}

const onEngagementsPageChange = async (page: number) => {
  await loadEngagements(page)
}

const onEngagementsPageSizeChange = async (pageSize: number) => {
  await loadEngagements(1, pageSize)
}

const onEngagementRecordsPageChange = async (page: number) => {
  await loadEngagementRecords(page)
}

const onEngagementRecordsPageSizeChange = async (pageSize: number) => {
  await loadEngagementRecords(1, pageSize)
}
</script>
