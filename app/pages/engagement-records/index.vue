<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section :class="ENGAGEMENT_RECORDS_PAGE_SECTION_CLASSES">
      <header :class="DEPLOYMENTS_PAGE_HEADER_CLASSES">
        <div>
          <h1 class="text-3xl font-semibold text-slate-900">{{ ENGAGEMENT_RECORDS_PAGE_TITLE }}</h1>
          <p class="text-sm text-slate-600">{{ ENGAGEMENT_RECORDS_PAGE_SUBTITLE }}</p>
        </div>
      </header>

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
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import EngagementRecordsFilter from '~/components/engagements/EngagementRecordsFilter.vue'
import EngagementRecordsTable from '~/components/engagements/EngagementRecordsTable.vue'
import EngagementsFilter from '~/components/engagements/EngagementsFilter.vue'
import EngagementsTable from '~/components/engagements/EngagementsTable.vue'
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
import { useEngagementManagementPageHandlers } from '~/handlers/engagements'
import { useAuthStore } from '~/stores/auth'
import { useEngagementsStore } from '~/stores/engagements'
import type { FieldValidationMap } from '~/utils/field-validation'

type EngagementRecordsTabId = 'records' | 'engagements'

const activeTab = ref<EngagementRecordsTabId>('engagements')
const hasLoadedEngagements = ref(false)
const hasLoadedEngagementRecords = ref(false)
const engagementsFilters = ref({})
const engagementRecordsFilters = ref({})
const engagementsFilterValidationErrors = ref<FieldValidationMap>({})
const engagementRecordsFilterValidationErrors = ref<FieldValidationMap>({})

const authStore = useAuthStore()
const engagementsStore = useEngagementsStore()

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
const isEngagementsLoading = computed(() => engagementsStore.engagements.isLoading)
const engagementsError = computed(() => engagementsStore.engagements.error)
const engagementsPagination = computed(() => engagementsStore.engagements.pagination)

const engagementRecordRows = computed(() => engagementsStore.records.items)
const isEngagementRecordsLoading = computed(() => engagementsStore.records.isLoading)
const engagementRecordsError = computed(() => engagementsStore.records.error)
const engagementRecordsPagination = computed(() => engagementsStore.records.pagination)

const loadEngagements = async (page = 1, pageSize?: number) => {
  await engagementsStore.fetchEngagements(page, engagementsFilters.value, pageSize)
  hasLoadedEngagements.value = true
}

const loadEngagementRecords = async (page = 1, pageSize?: number) => {
  await engagementsStore.fetchEngagementRecords(page, engagementRecordsFilters.value, pageSize)
  hasLoadedEngagementRecords.value = true
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

watch(activeTab, async (tabId) => {
  if (!authStore.hasPermissionAccess(ENGAGEMENT_PRIVILEGES.manage)) {
    return
  }

  if (tabId === 'engagements' && !hasLoadedEngagements.value) {
    await loadEngagements()
    return
  }

  if (tabId === 'records' && !hasLoadedEngagementRecords.value) {
    await loadEngagementRecords()
  }
}, { immediate: true })

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
