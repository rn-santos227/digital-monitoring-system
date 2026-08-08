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
          :value="totalEngagements"
        />
        <KpiCard
          title="Total Engagement Records"
          subtitle="Personnel engagement history records."
          icon-name="clipboard-document-list"
          tone="amber"
          :value="totalEngagementRecords"
        />
      </div>

      <BaseTab
        :model-value="activeTab"
        :items="visibleTabItems"
        :aria-label="ENGAGEMENT_RECORDS_PAGE_TABS_ARIA_LABEL"
        @update:model-value="handleTabChange"
      />

      <template v-if="activeTab === 'records'">
        <div class="flex justify-end gap-2">
          <PrintDataListButton
            table-name="engagement_records"
            table-label="Engagement Records"
            :filters="engagementRecordsFilters"
            :disabled="isEngagementRecordsLoading"
            :get-print-data="handlePrintEngagementRecords"
          />
          <BaseButton
            v-if="authStore.hasPermissionAccess(ENGAGEMENT_PRIVILEGES.create)"
            @click="isCreateEngagementRecordModalOpen = true"
          >
            Create Engagement Record
          </BaseButton>
        </div>

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
          v-model:selected-row-keys="selectedEngagementRecordIds"
          @update:current-page="onEngagementRecordsPageChange"
          @update:page-size="onEngagementRecordsPageSizeChange"
          @action="onEngagementRecordAction"
          @bulk-delete="deleteSelectedEngagementRecords"
        />
      </template>

      <template v-else-if="activeTab === 'engagements'">
        <div class="flex justify-end gap-2">
          <PrintDataListButton
            table-name="engagements"
            table-label="Engagements"
            :filters="engagementsFilters"
            :disabled="isEngagementsLoading"
            :get-print-data="handlePrintEngagements"
          />
          <BaseButton
            v-if="authStore.hasPermissionAccess(ENGAGEMENT_PRIVILEGES.create)"
            @click="onOpenCreateEngagementModal"
          >
            Create Engagement
          </BaseButton>
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
          v-model:selected-row-keys="selectedEngagementIds"
          @update:current-page="onEngagementsPageChange"
          @update:page-size="onEngagementsPageSizeChange"
          @action="onEngagementAction"
          @bulk-delete="deleteSelectedEngagements"
        />
      </template>

      <template v-else>
        <OperationsCalendar
          eyebrow="Engagement calendar"
          description="Review scheduled engagement operations by day, week, or month."
          :events="engagementCalendarEvents"
          :is-loading="isEngagementCalendarLoading"
          :error-message="engagementCalendarError"
          @visible-range-change="onEngagementCalendarRangeChange"
        />
      </template>
    </section>

      <CreateEngagementModal
        v-if="isCreateEngagementModalOpen"
        :is-submitting="isEngagementsLoading"
        :error-message="createEngagementErrorMessage"
        @close="onCloseCreateEngagementModal"
        @submit="onSubmitCreateEngagement"
      />

      <CreateEngagementRecordModal
        v-if="isCreateEngagementRecordModalOpen"
        :is-submitting="isEngagementRecordsLoading"
        @close="onCloseCreateEngagementRecordModal"
        @submit="onSubmitCreateEngagementRecord"
      />

      <UpdateEngagementModal
        v-if="selectedEngagement && isUpdateEngagementModalOpen"
        :initial-values="updateFormValues"
        :is-submitting="isEngagementsLoading"
        :error-message="updateEngagementErrorMessage"
        @close="onCloseUpdateEngagementModal"
        @submit="onSubmitUpdateEngagement"
      />

      <UpdateEngagementRecordModal
        v-if="selectedEngagementRecord && isUpdateEngagementRecordModalOpen"
        :initial-values="updateRecordFormValues"
        :is-submitting="isEngagementRecordsLoading"
        :error-message="updateEngagementRecordErrorMessage"
        @close="onCloseUpdateEngagementRecordModal"
        @submit="onSubmitUpdateEngagementRecord"
      />

      <ViewEngagementModal
        v-if="selectedEngagement && isViewEngagementModalOpen"
        :engagement="selectedEngagement"
        :personnel-rows="engagementPersonnelRows"
        @close="onCloseViewEngagementModal"
      />

      <ViewEngagementRecordModal
        v-if="selectedEngagementRecord && isViewEngagementRecordModalOpen"
        :record="selectedEngagementRecord"
        @close="onCloseViewEngagementRecordModal"
      />
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import KpiCard from '~/components/general/KpiCard.vue'
import OperationsCalendar from '~/components/calendar/OperationsCalendar.vue'
import CreateEngagementModal from '~/components/engagements/CreateEngagementModal.vue'
import CreateEngagementRecordModal from '~/components/engagements/CreateEngagementRecordModal.vue'
import EngagementRecordsFilter from '~/components/engagements/EngagementRecordsFilter.vue'
import EngagementRecordsTable from '~/components/engagements/EngagementRecordsTable.vue'
import EngagementsFilter from '~/components/engagements/EngagementsFilter.vue'
import EngagementsTable from '~/components/engagements/EngagementsTable.vue'
import UpdateEngagementModal from '~/components/engagements/UpdateEngagementModal.vue'
import UpdateEngagementRecordModal from '~/components/engagements/UpdateEngagementRecordModal.vue'
import ViewEngagementModal from '~/components/engagements/ViewEngagementModal.vue'
import ViewEngagementRecordModal from '~/components/engagements/ViewEngagementRecordModal.vue'
import PrintDataListButton from '~/components/general/PrintDataListButton.vue'
import { useDialog } from '~/composables/useDialog'
import { useEngagements } from '~/composables/useEngagements'
import {
  useCreateEngagementHandler,
  useCreateEngagementRecordHandler,
  useDeleteEngagementHandler,
  useDeleteEngagementRecordHandler,
  useBulkDeleteEngagementRecordsHandler,
  useBulkDeleteEngagementsHandler,
  useEngagementManagementPageHandlers,
  useEngagementTableActionHandlers,
  useEngagementTabHandler,
  useUpdateEngagementHandler,
  useUpdateEngagementRecordHandler,
  useViewEngagementHandler,
  useViewEngagementRecordHandler,
  usePrintEngagementsHandler,
} from '~/handlers/engagements'
import { useValidatedListHandlers, createCompleteListPrintHandler } from '~/handlers/shared'
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
import { APP_MAIN_CONTENT_CLASSES, DEPLOYMENTS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import type {
  EngagementManagementListItem,
  EngagementManagementSearchQuery,
  EngagementRecordsTabId,
} from '~/types/domain/engagement'
import type { CalendarEventsQuery } from '~/types/domain/calendar'
import type { FieldValidationMap } from '~/utils/field-validation'

const activeTab = ref<EngagementRecordsTabId>('engagements')
const hasLoadedPageData = ref(false)
const engagementsFilters = ref<Partial<EngagementManagementSearchQuery>>({})
const engagementRecordsFilters = ref<Partial<EngagementManagementSearchQuery>>({})
const engagementsFilterValidationErrors = ref<FieldValidationMap>({})
const engagementRecordsFilterValidationErrors = ref<FieldValidationMap>({})
const isCreateEngagementModalOpen = ref(false)
const isCreateEngagementRecordModalOpen = ref(false)
const isUpdateEngagementModalOpen = ref(false)
const isViewEngagementModalOpen = ref(false)
const isUpdateEngagementRecordModalOpen = ref(false)
const isViewEngagementRecordModalOpen = ref(false)
const createEngagementErrorMessage = ref('')
const updateEngagementErrorMessage = ref('')
const updateEngagementRecordErrorMessage = ref('')
const selectedEngagement = ref<EngagementManagementListItem | null>(null)
const selectedEngagementRecord = ref<EngagementManagementListItem | null>(null)
const engagementPersonnelRows = ref<Record<string, unknown>[]>([])
const { printEngagementRecords, printEngagements } = usePrintEngagementsHandler()

const authStore = useAuthStore()
const engagementsStore = useEngagementsStore()
const { showDialog } = useDialog()
const {
  createEngagement,
  createEngagementRecord,
  deleteEngagement,
  updateEngagement,
  getEngagementById,
  getEngagementPersonnel,
  getEngagementRecordById,
  updateEngagementRecord,
  deleteEngagementRecord,
  loadEngagementCalendarEvents,
} = useEngagements()

const selectedEngagementRecordIds = ref<string[]>([])
const selectedEngagementIds = ref<string[]>([])

const { deleteSelectedEngagementRecords } = useBulkDeleteEngagementRecordsHandler({
  selectedIds: selectedEngagementRecordIds,
  reload: async () => {
    await loadEngagementRecords()
  },
  showDialog,
})

const { deleteSelectedEngagements } = useBulkDeleteEngagementsHandler({
  selectedIds: selectedEngagementIds,
  reload: async () => {
    await loadEngagements()
  },
  showDialog,
})

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
const totalEngagements = computed(() => engagementsStore.kpis.totalEngagements)
const totalEngagementRecords = computed(() => engagementsStore.kpis.totalEngagementRecords)
const engagementCalendarEvents = computed(() => engagementsStore.calendar.items)
const isEngagementCalendarLoading = computed(() => engagementsStore.calendar.isLoading)
const engagementCalendarError = computed(() => engagementsStore.calendar.error)

const onEngagementCalendarRangeChange = async (query: CalendarEventsQuery) => {
  await loadEngagementCalendarEvents(query).catch(() => {})
}

const updateFormValues = computed(() => ({
  engagementTitle: selectedEngagement.value?.engagementTitle ?? '',
  engagementTypeId: selectedEngagement.value?.engagementTypeId ?? '',
  levelId: selectedEngagement.value?.levelId ?? '',
  statusId: selectedEngagement.value?.statusId ?? '',
  startDate: selectedEngagement.value?.startDate ?? '',
  endDate: selectedEngagement.value?.endDate ?? '',
  defaultRemarks: selectedEngagement.value?.defaultRemarks ?? '',
}))

const updateRecordFormValues = computed(() => ({
  personnel_id: selectedEngagementRecord.value?.personnelId ?? '',
  engagement_id: selectedEngagementRecord.value?.engagementId ?? '',
  personnel_name: selectedEngagementRecord.value?.personnelName ?? '',
  engagement_title: selectedEngagementRecord.value?.engagementTitle ?? '',
  role: selectedEngagementRecord.value?.role ?? '',
  location: selectedEngagementRecord.value?.location ?? '',
  start_date: selectedEngagementRecord.value?.startDate ?? '',
  end_date: selectedEngagementRecord.value?.endDate ?? '',
  remarks: selectedEngagementRecord.value?.remarks ?? '',
}))

const loadEngagements = async (page = 1, pageSize?: number) => {
  await engagementsStore.fetchEngagements(page, engagementsFilters.value, pageSize)
}

const loadEngagementRecords = async (page = 1, pageSize?: number) => {
  await engagementsStore.fetchEngagementRecords(page, engagementRecordsFilters.value, pageSize)
}

const handlePrintEngagements = createCompleteListPrintHandler({
  rows: engagementRows,
  pagination: engagementsPagination,
  loadPage: (page, pageSize) => loadEngagements(page, pageSize),
  printItems: printEngagements,
})

const handlePrintEngagementRecords = createCompleteListPrintHandler({
  rows: engagementRecordRows,
  pagination: engagementRecordsPagination,
  loadPage: (page, pageSize) => loadEngagementRecords(page, pageSize),
  printItems: printEngagementRecords,
})

const {
  handleApplyFilters: onApplyEngagementsFilter,
  handleResetFilters: onResetEngagementsFilter,
  handlePageChange: onEngagementsPageChange,
  handlePageSizeChange: onEngagementsPageSizeChange,
} = useValidatedListHandlers({
  filters: engagementsFilters,
  validationErrors: engagementsFilterValidationErrors,
  applyFilters: handleEngagementsFilterApply,
  resetFilters: handleEngagementsFilterReset,
  loadPage: (page = 1, _filters, pageSize) => loadEngagements(page, pageSize),
})

const {
  handleApplyFilters: onApplyEngagementRecordsFilter,
  handleResetFilters: onResetEngagementRecordsFilter,
  handlePageChange: onEngagementRecordsPageChange,
  handlePageSizeChange: onEngagementRecordsPageSizeChange,
} = useValidatedListHandlers({
  filters: engagementRecordsFilters,
  validationErrors: engagementRecordsFilterValidationErrors,
  applyFilters: handleEngagementRecordsFilterApply,
  resetFilters: handleEngagementRecordsFilterReset,
  loadPage: (page = 1, _filters, pageSize) => loadEngagementRecords(page, pageSize),
})

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
  onCloseCreateEngagementRecordModal,
  onSubmitCreateEngagementRecord,
} = useCreateEngagementRecordHandler({
  isCreateEngagementRecordModalOpen,
  createEngagementRecord,
  showDialog,
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

const { onDeleteEngagementRecord } = useDeleteEngagementRecordHandler({
  deleteEngagementRecord,
  showDialog,
})

const {
  onOpenViewEngagementRecordModal,
  onCloseViewEngagementRecordModal,
} = useViewEngagementRecordHandler({
  selectedEngagementRecord,
  isViewEngagementRecordModalOpen,
  getEngagementRecordById,
})

const {
  onOpenUpdateEngagementRecordModal,
  onCloseUpdateEngagementRecordModal,
  onSubmitUpdateEngagementRecord,
} = useUpdateEngagementRecordHandler({
  selectedEngagementRecord,
  isUpdateEngagementRecordModalOpen,
  errorMessage: updateEngagementRecordErrorMessage,
  getEngagementRecordById,
  updateEngagementRecord,
  showDialog,
})

const {
  onEngagementAction,
  onEngagementRecordAction,
} = useEngagementTableActionHandlers({
  onOpenViewEngagementModal,
  onOpenUpdateEngagementModal,
  onDeleteEngagement,
  onOpenViewEngagementRecordModal,
  onOpenUpdateEngagementRecordModal,
  onDeleteEngagementRecord,
})

const { handleTabChange } = useEngagementTabHandler(activeTab)

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

</script>
