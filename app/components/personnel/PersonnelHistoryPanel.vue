<template>
  <section :class="PERSONNEL_HISTORY_SECTION_CLASSES">
    <BaseAlert v-if="error" :message="error" tone="danger" />
    <div v-if="canManage" :class="PERSONNEL_HISTORY_ACTIONS_CLASSES">
      <BaseButton :disabled="isLoading || isSubmitting" @click="onAdd">{{ labels.addLabel }}</BaseButton>
    </div>
    <PersonnelHistoryTable
      :kind="kind"
      :rows="items"
      :is-loading="isLoading"
      :current-page="page"
      :page-size="pageSize"
      :total-items="totalItems"
      :total-pages="totalPages"
      @action="onAction"
      @update:current-page="page = $event"
      @update:page-size="onPageSizeChange"
    />
    <PersonnelHistoryFormModal
      v-if="modalOpen && (readOnly ? canView : canManage)"
      :kind="kind"
      :initial-values="editing"
      :read-only="readOnly"
      :is-submitting="isSubmitting"
      :error-message="formError"
      @close="onClose"
      @submit="onSave"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PersonnelHistoryTable from '~/components/personnel/PersonnelHistoryTable.vue'
import PersonnelHistoryFormModal from '~/components/personnel/PersonnelHistoryFormModal.vue'
import { useDialog } from '~/composables/useDialog'
import { useAuthStore } from '~/stores/auth'
import { PERSONNEL_PRIVILEGES } from '~/constants/privileges.constants'
import {
  PERSONNEL_HISTORY_LABELS,
  PERSONNEL_HISTORY_LOAD_ERROR,
  PERSONNEL_HISTORY_SAVE_ERROR,
  PERSONNEL_HISTORY_REMOVE_ERROR,
  PERSONNEL_HISTORY_REMOVE_TITLE,
  PERSONNEL_HISTORY_REMOVE_MESSAGE,
  PERSONNEL_HISTORY_REMOVE_LABEL,
  PERSONNEL_HISTORY_CANCEL_LABEL,
} from '~/constants/page.constants'
import { PERSONNEL_HISTORY_SECTION_CLASSES, PERSONNEL_HISTORY_ACTIONS_CLASSES } from '~/constants/shared.constants'
import type { PersonnelHistoryKind, PersonnelHistoryItem, SavePersonnelHistoryRequest } from '~/types/domain/personnel-history'
import { extractApiErrorMessage } from '~/utils/api-request'
import { showErrorDialog } from '~/utils/error-handling'
import { getPersonnelHistoryEndpoint, createPersonnelHistoryEndpoint, updatePersonnelHistoryEndpoint, deletePersonnelHistoryEndpoint } from '~/utils/personnel-history-endpoints'

const props = defineProps<{ personnelId: string; kind: PersonnelHistoryKind }>()
const authStore = useAuthStore()
const { showDialog } = useDialog()
const labels = computed(() => PERSONNEL_HISTORY_LABELS[props.kind])
const canManage = computed(() => authStore.hasPermissionAccess(PERSONNEL_PRIVILEGES.edit))
const canView = computed(() => authStore.hasPermissionAccess(PERSONNEL_PRIVILEGES.view))
const items = ref<PersonnelHistoryItem[]>([])
const page = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))
const isLoading = ref(false)
const isSubmitting = ref(false)
const modalOpen = ref(false)
const readOnly = ref(false)
const editing = ref<PersonnelHistoryItem | null>(null)
const error = ref('')
const formError = ref('')
let requestVersion = 0

const load = async () => {
  const version = ++requestVersion
  isLoading.value = true
  error.value = ''
  try {
    const result = await getPersonnelHistoryEndpoint(props.personnelId, props.kind, page.value, pageSize.value)
    if (version === requestVersion) {
      items.value = result.items
      totalItems.value = result.totalItems
    }
  } catch (failure) {
    if (version === requestVersion) error.value = extractApiErrorMessage(failure, PERSONNEL_HISTORY_LOAD_ERROR)
  } finally {
    if (version === requestVersion) isLoading.value = false
  }
}
const onClose = () => {
  if (!isSubmitting.value) modalOpen.value = false
}
const onAdd = () => {
  if (!canManage.value || isLoading.value || isSubmitting.value) return
  editing.value = null
  readOnly.value = false
  formError.value = ''
  modalOpen.value = true
}
const onPageSizeChange = (value: number) => {
  page.value = 1
  pageSize.value = value
}
const onSave = async (payload: SavePersonnelHistoryRequest) => {
  if (!canManage.value || readOnly.value || isSubmitting.value) return
  const { personnelId, kind } = props
  const existing = editing.value
  isSubmitting.value = true
  formError.value = ''
  try {
    const result = existing
      ? await updatePersonnelHistoryEndpoint(personnelId, kind, existing.id, payload)
      : await createPersonnelHistoryEndpoint(personnelId, kind, payload)
    if (personnelId !== props.personnelId || kind !== props.kind) return
    if (existing) items.value = items.value.map((item) => item.id === result.id ? result.item : item)
    else {
      totalItems.value += 1
      if (page.value === 1) items.value = [result.item, ...items.value].slice(0, pageSize.value)
      else page.value = 1
    }
    modalOpen.value = false
  } catch (failure) {
    if (personnelId !== props.personnelId || kind !== props.kind) return
    formError.value = extractApiErrorMessage(failure, PERSONNEL_HISTORY_SAVE_ERROR)
    await showErrorDialog({ showDialog, title: PERSONNEL_HISTORY_SAVE_ERROR, error: new Error(formError.value) })
  } finally {
    isSubmitting.value = false
  }
}
const onAction = async ({ actionKey, row }: { actionKey: string; row: PersonnelHistoryItem }) => {
  if (isLoading.value || isSubmitting.value) return
  if (actionKey === 'view-history' || actionKey === 'edit-history') {
    if (actionKey === 'view-history' ? !canView.value : !canManage.value) return
    editing.value = row
    readOnly.value = actionKey === 'view-history'
    formError.value = ''
    modalOpen.value = true
    return
  }
  if (actionKey !== 'remove-history' || !canManage.value) return
  const { personnelId, kind } = props
  const result = await showDialog({
    type: 'question', title: PERSONNEL_HISTORY_REMOVE_TITLE, message: PERSONNEL_HISTORY_REMOVE_MESSAGE,
    confirmLabel: PERSONNEL_HISTORY_REMOVE_LABEL, cancelLabel: PERSONNEL_HISTORY_CANCEL_LABEL,
  })
  if (!result.confirmed || !canManage.value || personnelId !== props.personnelId || kind !== props.kind) return
  isSubmitting.value = true
  try {
    await deletePersonnelHistoryEndpoint(personnelId, kind, row.id)
    if (personnelId !== props.personnelId || kind !== props.kind) return
    items.value = items.value.filter((item) => item.id !== row.id)
    totalItems.value = Math.max(totalItems.value - 1, 0)
    if (page.value > Math.max(totalPages.value, 1)) page.value = Math.max(totalPages.value, 1)
    else await load()
  } catch (failure) {
    if (personnelId === props.personnelId && kind === props.kind) await showErrorDialog({ showDialog, title: PERSONNEL_HISTORY_REMOVE_ERROR, error: failure })
  } finally {
    isSubmitting.value = false
  }
}
watch(() => [props.personnelId, props.kind], () => {
  modalOpen.value = false
  editing.value = null
  items.value = []
  totalItems.value = 0
  page.value = 1
})
watch(() => [props.personnelId, props.kind, page.value, pageSize.value], load, { immediate: true })
</script>
