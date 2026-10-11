<template>
  <section :class="PERSONNEL_HISTORY_SECTION_CLASSES">
    <BaseCard :title="PERSONNEL_FEEDBACK_TITLE" :subtitle="PERSONNEL_FEEDBACK_DESCRIPTION" />
    <BaseAlert v-if="error" :message="error" tone="danger" />
    <div v-if="canOfficiate" :class="PERSONNEL_HISTORY_ACTIONS_CLASSES">
      <BaseButton :disabled="isSubmitting || isLoading" @click="onAdd">{{ PERSONNEL_FEEDBACK_ADD_LABEL }}</BaseButton>
    </div>
    <BaseInlineLoader v-if="isLoading" />
    <template v-else>
      <BaseCard v-if="items.length === 0 && !error" :subtitle="PERSONNEL_FEEDBACK_EMPTY_MESSAGE" />
      <BaseCard v-for="item in items" :key="item.id" :title="formatDate(item.reviewDate)">
        <p :class="PERSONNEL_FEEDBACK_BODY_CLASSES">{{ item.feedback }}</p>
        <div :class="PERSONNEL_FEEDBACK_AUTHOR_CLASSES">
          <p v-if="item.rating !== null">{{ PERSONNEL_FEEDBACK_RATING_LABEL }}: {{ item.rating }} / 5</p>
          <p>{{ item.authorRank }} {{ item.authorName }} · {{ item.authorServiceNumber }}</p>
          <p v-if="item.authorTitle">{{ item.authorTitle }}</p>
          <p>{{ PERSONNEL_FEEDBACK_OFFICIATED_LABEL }}: {{ formatPersonnelFeedbackTime(item.officiatedAt) }}</p>
        </div>
      </BaseCard>
      <Pagination
        :current-page="page"
        :total-pages="totalPages"
        :total-items="totalItems"
        :page-size="pageSize"
        @update:current-page="page = $event"
        @update:page-size="onPageSizeChange"
      />
    </template>
    <PersonnelFeedbackFormModal
      v-if="modalOpen && canOfficiate"
      :is-submitting="isSubmitting"
      :error-message="formError"
      @close="onClose"
      @submit="onSave"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import PersonnelFeedbackFormModal from '~/components/personnel/PersonnelFeedbackFormModal.vue'
import Pagination from '~/components/table/Pagination.vue'
import { useAuthStore } from '~/stores/auth'
import { useDateDisplay } from '~/composables/useDateDisplay'
import { useDialog } from '~/composables/useDialog'
import { PERSONNEL_PRIVILEGES } from '~/constants/privileges.constants'
import {
  PERSONNEL_FEEDBACK_TITLE,
  PERSONNEL_FEEDBACK_DESCRIPTION,
  PERSONNEL_FEEDBACK_ADD_LABEL,
  PERSONNEL_FEEDBACK_EMPTY_MESSAGE,
  PERSONNEL_FEEDBACK_LOAD_ERROR,
  PERSONNEL_FEEDBACK_SAVE_ERROR,
  PERSONNEL_FEEDBACK_RATING_LABEL,
  PERSONNEL_FEEDBACK_OFFICIATED_LABEL,
} from '~/constants/page.constants'
import {
  PERSONNEL_HISTORY_SECTION_CLASSES,
  PERSONNEL_HISTORY_ACTIONS_CLASSES,
  PERSONNEL_FEEDBACK_BODY_CLASSES,
  PERSONNEL_FEEDBACK_AUTHOR_CLASSES,
} from '~/constants/shared.constants'
import type { CreatePersonnelFeedbackRequest, PersonnelFeedbackItem } from '~/types/domain/personnel-feedback'
import { getPersonnelFeedbackEndpoint, createPersonnelFeedbackEndpoint } from '~/utils/personnel-feedback-endpoints'
import { extractApiErrorMessage } from '~/utils/api-request'
import { showErrorDialog } from '~/utils/error-handling'
import { formatPersonnelFeedbackTime } from '~/utils/personnel-feedback'

const props = defineProps<{ personnelId: string }>()
const authStore = useAuthStore()
const { formatDate } = useDateDisplay()
const { showDialog } = useDialog()
const canOfficiate = computed(() => authStore.hasPermissionAccess(PERSONNEL_PRIVILEGES.feedback))
const items = ref<PersonnelFeedbackItem[]>([])
const page = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value))
const isLoading = ref(false)
const isSubmitting = ref(false)
const modalOpen = ref(false)
const formError = ref('')
const error = ref('')
let requestVersion = 0
const load = async () => {
  const version = ++requestVersion
  isLoading.value = true
  error.value = ''
  try {
    const result = await getPersonnelFeedbackEndpoint(props.personnelId, page.value, pageSize.value)
    if (version === requestVersion) {
      items.value = result.items
      totalItems.value = result.totalItems
    }
  } catch (failure) {
    if (version === requestVersion) error.value = extractApiErrorMessage(failure, PERSONNEL_FEEDBACK_LOAD_ERROR)
  } finally {
    if (version === requestVersion) isLoading.value = false
  }
}
const onAdd = () => {
  if (!canOfficiate.value || isSubmitting.value || isLoading.value) return
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
const onSave = async (payload: CreatePersonnelFeedbackRequest) => {
  if (!canOfficiate.value || isSubmitting.value) return
  const personnelId = props.personnelId
  isSubmitting.value = true
  formError.value = ''
  try {
    const result = await createPersonnelFeedbackEndpoint(personnelId, payload)
    if (personnelId !== props.personnelId) return
    totalItems.value += 1
    if (page.value === 1) items.value = [result.item, ...items.value].slice(0, pageSize.value)
    else page.value = 1
    modalOpen.value = false
  } catch (failure) {
    if (personnelId !== props.personnelId) return
    formError.value = extractApiErrorMessage(failure, PERSONNEL_FEEDBACK_SAVE_ERROR)
    await showErrorDialog({ showDialog, title: PERSONNEL_FEEDBACK_SAVE_ERROR, error: new Error(formError.value) })
  } finally {
    isSubmitting.value = false
  }
}
watch(() => props.personnelId, () => {
  modalOpen.value = false
  items.value = []
  totalItems.value = 0
  page.value = 1
})
watch(() => [props.personnelId, page.value, pageSize.value], load, { immediate: true })
</script>
