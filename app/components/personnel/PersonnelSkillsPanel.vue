<template>
  <section :class="PERSONNEL_SKILLS_SECTION_CLASSES">
    <BaseAlert v-if="error" :message="error" tone="danger" />
    <div v-if="canManage" :class="PERSONNEL_SKILLS_ACTIONS_CLASSES">
      <BaseButton :disabled="isSubmitting || isLoading" @click="onAdd">{{ PERSONNEL_SKILL_ADD_LABEL }}</BaseButton>
    </div>
    <PersonnelSkillsTable
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
    <PersonnelSkillFormModal
      v-if="modalOpen && canManage"
      :personnel-id="personnelId"
      :initial-values="editing"
      :is-submitting="isSubmitting"
      :error-message="formError"
      :warning-message="editing && !editing.source ? PERSONNEL_SKILL_LEGACY_WARNING : ''"
      @close="onClose"
      @submit="onSave"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PersonnelSkillsTable from '~/components/personnel/PersonnelSkillsTable.vue'
import PersonnelSkillFormModal from '~/components/personnel/PersonnelSkillFormModal.vue'
import { useDialog } from '~/composables/useDialog'
import { PERSONNEL_PRIVILEGES } from '~/constants/privileges.constants'
import {
  PERSONNEL_SKILL_ADD_LABEL,
  PERSONNEL_SKILL_LEGACY_WARNING,
  PERSONNEL_SKILL_REMOVE_TITLE,
  PERSONNEL_SKILL_REMOVE_MESSAGE,
  PERSONNEL_SKILL_REMOVE_LABEL,
  PERSONNEL_SKILL_CANCEL_LABEL,
  PERSONNEL_SKILL_SAVE_ERROR_TITLE,
  PERSONNEL_SKILL_REMOVE_ERROR_TITLE,
  PERSONNEL_SKILL_LOAD_ERROR_MESSAGE,
} from '~/constants/page.constants'
import { PERSONNEL_SKILLS_SECTION_CLASSES, PERSONNEL_SKILLS_ACTIONS_CLASSES } from '~/constants/shared.constants'
import { useAuthStore } from '~/stores/auth'
import type { PersonnelSkillItem, SavePersonnelSkillRequest } from '~/types/domain/personnel-skills'
import { extractApiErrorMessage } from '~/utils/api-request'
import { showErrorDialog } from '~/utils/error-handling'
import {
  getPersonnelSkillsEndpoint,
  createPersonnelSkillEndpoint,
  updatePersonnelSkillEndpoint,
  deletePersonnelSkillEndpoint,
} from '~/utils/personnel-skills-endpoints'

const props = defineProps<{ personnelId: string }>()
const authStore = useAuthStore()
const { showDialog } = useDialog()
const canManage = computed(() => authStore.hasPermissionAccess(PERSONNEL_PRIVILEGES.edit))
const items = ref<PersonnelSkillItem[]>([])
const totalItems = ref(0)
const page = ref(1)
const pageSize = ref(10)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))
const isLoading = ref(false)
const isSubmitting = ref(false)
const error = ref('')
const formError = ref('')
const modalOpen = ref(false)
const editing = ref<PersonnelSkillItem | null>(null)
let requestVersion = 0

const load = async () => {
  const version = ++requestVersion
  isLoading.value = true
  error.value = ''
  try {
    const result = await getPersonnelSkillsEndpoint(props.personnelId, page.value, pageSize.value)
    if (version === requestVersion) {
      items.value = result.items
      totalItems.value = result.totalItems
    }
  } catch (failure) {
    if (version === requestVersion) error.value = extractApiErrorMessage(failure, PERSONNEL_SKILL_LOAD_ERROR_MESSAGE)
  } finally {
    if (version === requestVersion) isLoading.value = false
  }
}

const onAdd = () => {
  if (!canManage.value || isSubmitting.value || isLoading.value) return
  editing.value = null
  formError.value = ''
  modalOpen.value = true
}
const onClose = () => {
  if (!isSubmitting.value) modalOpen.value = false
}
const onPageSizeChange = (value: number) => {
  page.value = 1
  pageSize.value = value
}

const onSave = async (payload: SavePersonnelSkillRequest) => {
  if (!canManage.value || isSubmitting.value) return
  const personnelId = props.personnelId
  const existing = editing.value
  isSubmitting.value = true
  formError.value = ''
  try {
    const result = existing
      ? await updatePersonnelSkillEndpoint(personnelId, existing.id, payload)
      : await createPersonnelSkillEndpoint(personnelId, payload)
    if (personnelId !== props.personnelId) return
    if (existing) {
      items.value = items.value.map((item) => item.id === result.id ? result.item : item)
    } else {
      totalItems.value += 1
      if (page.value === 1) items.value = [result.item, ...items.value].slice(0, pageSize.value)
      else page.value = 1
    }
    modalOpen.value = false
  } catch (failure) {
    if (personnelId !== props.personnelId) return
    formError.value = extractApiErrorMessage(failure, PERSONNEL_SKILL_SAVE_ERROR_TITLE)
    await showErrorDialog({ showDialog, title: PERSONNEL_SKILL_SAVE_ERROR_TITLE, error: new Error(formError.value) })
  } finally {
    isSubmitting.value = false
  }
}

const onAction = async ({ actionKey, row }: { actionKey: string; row: PersonnelSkillItem }) => {
  if (!canManage.value || isSubmitting.value || isLoading.value) return
  if (actionKey === 'edit-skill') {
    editing.value = row
    formError.value = ''
    modalOpen.value = true
    return
  }
  if (actionKey !== 'remove-skill') return
  const personnelId = props.personnelId
  const result = await showDialog({
    type: 'question', title: PERSONNEL_SKILL_REMOVE_TITLE, message: `${row.name}: ${PERSONNEL_SKILL_REMOVE_MESSAGE}`,
    confirmLabel: PERSONNEL_SKILL_REMOVE_LABEL, cancelLabel: PERSONNEL_SKILL_CANCEL_LABEL,
  })
  if (!result.confirmed || personnelId !== props.personnelId || !canManage.value) return
  isSubmitting.value = true
  try {
    await deletePersonnelSkillEndpoint(personnelId, row.id)
    if (personnelId !== props.personnelId) return
    totalItems.value = Math.max(totalItems.value - 1, 0)
    if (page.value > Math.max(totalPages.value, 1)) page.value = Math.max(totalPages.value, 1)
    else await load()
  } catch (failure) {
    if (personnelId !== props.personnelId) return
    await showErrorDialog({ showDialog, title: PERSONNEL_SKILL_REMOVE_ERROR_TITLE, error: failure })
  } finally {
    isSubmitting.value = false
  }
}

watch(() => props.personnelId, () => {
  modalOpen.value = false
  editing.value = null
  items.value = []
  totalItems.value = 0
  page.value = 1
})
watch(() => [props.personnelId, page.value, pageSize.value], load, { immediate: true })
</script>
