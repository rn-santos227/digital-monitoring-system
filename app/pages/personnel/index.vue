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
        <BaseTab
          :model-value="activeTab"
          :items="visibleTabItems"
          :aria-label="PERSONNEL_PAGE_TABS_ARIA_LABEL"
          @update:model-value="onTabChange"
        />

        <template v-if="activeTab === 'personnel-records'">
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

          <PersonnelTable
            :rows="tableRows"
            row-key="id"
            :is-loading="isLoading"
            :current-page="pagination.page"
            :total-pages="pagination.totalPages"
            :can-view-personnel="canViewPersonnel"
            :can-edit-personnel="canEditPersonnel"
            :can-delete-personnel="canDeletePersonnel"
            @update:current-page="handlePageChange"
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
            <div v-if="canCreatePersonnel" class="flex items-end">
              <BaseButton @click="isCreateRankModalOpen = true">{{ RANK_CREATE_BUTTON_LABEL }}</BaseButton>
            </div>
          </div>
          <BaseAlert v-if="rankError" :message="rankError" tone="danger" />
          <RanksTable
            :rows="rankRows"
            :is-loading="isRanksLoading"
            :current-page="rankPagination.page"
            :total-pages="rankPagination.totalPages"
            :can-delete="canDeletePersonnel"
            @update:current-page="onRankPageChange"
            @action="onRankTableAction"
          />
        </template>
      </template>

      <CreatePersonnelModal
        v-if="isCreatePersonnelModalOpen"
        @close="closeCreatePersonnelModal"
        @submit="handleCreatePersonnel"
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
import CreateRankModal from '~/components/personnel/CreateRankModal.vue'
import CreatePersonnelModal from '~/components/personnel/CreatePersonnelModal.vue'
import PersonnelFilter from '~/components/personnel/PersonnelFilter.vue'
import PersonnelTable from '~/components/personnel/PersonnelTable.vue'
import RanksTable from '~/components/personnel/RanksTable.vue'
import UpdatePersonnelModal from '~/components/personnel/UpdatePersonnelModal.vue'
import { useRanks } from '~/composables/useRanks'
import {
  PERSONNEL_CREATE_BUTTON_LABEL,
  PERSONNEL_PAGE_REQUIRED_PERMISSIONS,
  PERSONNEL_PAGE_SECTION_CLASSES,
  PERSONNEL_PAGE_SUBTITLE,
  PERSONNEL_PAGE_TAB_ITEMS,
  PERSONNEL_PAGE_TAB_REQUIRED_PERMISSIONS,
  PERSONNEL_PAGE_TABS_ARIA_LABEL,
  PERSONNEL_PAGE_TITLE,
  RANK_CREATE_BUTTON_LABEL,
} from '~/constants/page.constants'
import {
  APP_MAIN_CONTENT_CLASSES,
  PERSONNEL_PAGE_HEADER_CLASSES,
  PERSONNEL_TABLE_ACTIONS_ROW_CLASSES,
} from '~/constants/shared.constants'
import { useDialog } from '~/composables/useDialog'
import { usePersonnel } from '~/composables/usePersonnel'
import { useToast } from '~/composables/useToast'
import { useCreatePersonnelModalHandler, usePersonnelPageHandlers, useViewPersonnelProfileHandler } from '~/handlers'
import { useAuthStore } from '~/stores/auth'
import type { CreatePersonnelPayload, PersonnelDetail, PersonnelSearchQuery, UpdatePersonnelPayload } from '~/types/domain/personnel'
import type { FieldValidationMap } from '~/utils/field-validation'
import type { CreateRankPayload } from '~/types/domain/rank'

const { filters, tableRows, pagination, isLoading, error, loadPersonnel, createPersonnel, updatePersonnel, deletePersonnel, getPersonnelById } = usePersonnel()
const { tableRows: rankRows, pagination: rankPagination, isLoading: isRanksLoading, error: rankError, search: rankSearchTerm, loadRanks, createRank, deleteRank } = useRanks()
const { handleFilterApply, handleFilterReset } = usePersonnelPageHandlers(filters)
const { handleViewPersonnelProfile } = useViewPersonnelProfileHandler()
const authStore = useAuthStore()
const { addToast } = useToast()
const { showDialog } = useDialog()

const filterValidationErrors = ref<FieldValidationMap>({})
const isCreatePersonnelModalOpen = ref(false)
const isUpdatePersonnelModalOpen = ref(false)
const isCreateRankModalOpen = ref(false)
const selectedPersonnel = ref<PersonnelDetail | null>(null)
const activeTab = ref<'personnel-records' | 'rank-management'>('personnel-records')
const { openCreatePersonnelModal, closeCreatePersonnelModal } = useCreatePersonnelModalHandler(isCreatePersonnelModalOpen)
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

watch(canViewPersonnel, (hasAccess) => {
  if (!hasAccess) {
    return
  }

  void Promise.all([loadPersonnel(1), loadRanks(1)])
}, { immediate: true })

const onTabChange = (nextTab: string) => {
  activeTab.value = nextTab === 'rank-management' ? 'rank-management' : 'personnel-records'
}

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

const closeUpdatePersonnelModal = () => {
  isUpdatePersonnelModalOpen.value = false
  selectedPersonnel.value = null
}

const handleUpdatePersonnel = async (payload: UpdatePersonnelPayload) => {
  if (!selectedPersonnel.value) {
    return
  }

  try {
    await updatePersonnel(selectedPersonnel.value.id, payload)
    closeUpdatePersonnelModal()
    addToast({
      title: 'Personnel updated',
      message: 'Personnel record has been updated successfully.',
      variant: 'success',
    })
  } catch {
    addToast({
      title: 'Personnel update failed',
      message: 'Unable to update personnel record right now.',
      variant: 'error',
    })
  }
}

const handleDeletePersonnel = async (id: string) => {
  const result = await showDialog({
    type: 'warning',
    title: 'Delete personnel record?',
    message: 'This action cannot be undone. Do you want to continue?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  })

  if (!result.confirmed) {
    return
  }

  try {
    await deletePersonnel(id)
    addToast({
      title: 'Personnel deleted',
      message: 'Personnel record has been deleted successfully.',
      variant: 'success',
    })
  } catch {
    addToast({
      title: 'Personnel deletion failed',
      message: 'Unable to delete personnel record right now.',
      variant: 'error',
    })
  }
}

const handleTableAction = async (payload: { actionKey: string; row: { id: string } }) => {
  if (payload.actionKey === 'view-personnel-profile') {
    await handleViewPersonnelProfile(payload.row.id)
    return
  }

  if (payload.actionKey === 'edit-personnel') {
    try {
      selectedPersonnel.value = await getPersonnelById(payload.row.id)
      isUpdatePersonnelModalOpen.value = Boolean(selectedPersonnel.value)
    } catch {
      addToast({
        title: 'Personnel load failed',
        message: 'Unable to load personnel details for editing.',
        variant: 'error',
      })
    }
    return
  }

  if (payload.actionKey === 'delete-personnel') {
    await handleDeletePersonnel(payload.row.id)
  }
}


const onRankSearchTermChange = async (value: string | number) => {
  const searchTerm = String(value ?? '')
  await loadRanks(1, searchTerm)
}

const onRankPageChange = async (page: number) => {
  await loadRanks(page, rankSearchTerm.value)
}

const handleCreateRank = async (payload: CreateRankPayload) => {
  try {
    await createRank(payload)
    isCreateRankModalOpen.value = false
    addToast({
      title: 'Rank created',
      message: 'Rank record has been created successfully.',
      variant: 'success',
    })
  } catch {
    addToast({
      title: 'Rank creation failed',
      message: 'Unable to create rank record right now.',
      variant: 'error',
    })
  }
}

const onRankTableAction = async (payload: { actionKey: string; row: { id: string } }) => {
  if (payload.actionKey !== 'delete-rank') {
    return
  }

  const result = await showDialog({
    type: 'warning',
    title: 'Delete rank record?',
    message: 'This action cannot be undone. Do you want to continue?',
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
  })

  if (!result.confirmed) {
    return
  }

  try {
    await deleteRank(payload.row.id)
    addToast({
      title: 'Rank deleted',
      message: 'Rank record has been deleted successfully.',
      variant: 'success',
    })
  } catch {
    addToast({
      title: 'Rank deletion failed',
      message: 'Unable to delete rank record right now.',
      variant: 'error',
    })
  }
}
</script>
