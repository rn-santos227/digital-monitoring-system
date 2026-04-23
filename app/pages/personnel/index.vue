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
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import CreatePersonnelModal from '~/components/personnel/CreatePersonnelModal.vue'
import PersonnelFilter from '~/components/personnel/PersonnelFilter.vue'
import PersonnelTable from '~/components/personnel/PersonnelTable.vue'
import UpdatePersonnelModal from '~/components/personnel/UpdatePersonnelModal.vue'
import {
  PERSONNEL_CREATE_BUTTON_LABEL,
  PERSONNEL_PAGE_REQUIRED_PERMISSIONS,
  PERSONNEL_PAGE_SECTION_CLASSES,
  PERSONNEL_PAGE_SUBTITLE,
  PERSONNEL_PAGE_TITLE,
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

const { filters, tableRows, pagination, isLoading, error, loadPersonnel, createPersonnel, updatePersonnel, deletePersonnel, getPersonnelById } = usePersonnel()
const { handleFilterApply, handleFilterReset } = usePersonnelPageHandlers(filters)
const { handleViewPersonnelProfile } = useViewPersonnelProfileHandler()
const authStore = useAuthStore()
const { addToast } = useToast()
const { showDialog } = useDialog()

const filterValidationErrors = ref<FieldValidationMap>({})
const isCreatePersonnelModalOpen = ref(false)
const isUpdatePersonnelModalOpen = ref(false)
const selectedPersonnel = ref<PersonnelDetail | null>(null)
const { openCreatePersonnelModal, closeCreatePersonnelModal } = useCreatePersonnelModalHandler(isCreatePersonnelModalOpen)

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
</script>
