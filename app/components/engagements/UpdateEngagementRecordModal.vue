<template>
  <BaseModal
    :title="ENGAGEMENT_RECORDS_UPDATE_MODAL_TITLE"
    :description="ENGAGEMENT_RECORDS_UPDATE_MODAL_DESCRIPTION"
    size="lg"
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField
          :model-value="personnelDisplayName"
          :label="ENGAGEMENT_RECORDS_PERSONNEL_LABEL"
          readonly
        />

        <BaseTextField
          :model-value="engagementDisplayName"
          :label="ENGAGEMENT_RECORDS_ENGAGEMENT_LABEL"
          readonly
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.role" :label="ENGAGEMENT_RECORDS_ROLE_LABEL" :error="errors.role" />
        <BaseTextField v-model="form.location" :label="ENGAGEMENT_RECORDS_LOCATION_LABEL" :error="errors.location" />
        <BaseDatePicker v-model="form.start_date" :label="ENGAGEMENT_RECORDS_START_DATE_LABEL" :error="errors.start_date" />
        <BaseDatePicker v-model="form.end_date" :label="ENGAGEMENT_RECORDS_END_DATE_LABEL" :error="errors.end_date" />
      </div>

      <BaseTextArea
        v-model="form.remarks"
        :label="ENGAGEMENT_RECORDS_REMARKS_LABEL"
        :placeholder="ENGAGEMENT_RECORDS_REMARKS_PLACEHOLDER"
        :error="errors.remarks"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="onResetForm">Reset</BaseButton>
        <BaseButton variant="ghost" @click="onCloseRequest">{{ TRAININGS_MODAL_CANCEL_LABEL }}</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">{{ TRAININGS_MODAL_UPDATE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useDialog } from '~/composables/useDialog'
import {
  ENGAGEMENT_RECORDS_END_DATE_LABEL,
  ENGAGEMENT_RECORDS_ENGAGEMENT_LABEL,
  ENGAGEMENT_RECORDS_LOCATION_LABEL,
  ENGAGEMENT_RECORDS_PERSONNEL_LABEL,
  ENGAGEMENT_RECORDS_REMARKS_LABEL,
  ENGAGEMENT_RECORDS_REMARKS_PLACEHOLDER,
  ENGAGEMENT_RECORDS_ROLE_LABEL,
  ENGAGEMENT_RECORDS_START_DATE_LABEL,
  ENGAGEMENT_RECORDS_UPDATE_MODAL_DESCRIPTION,
  ENGAGEMENT_RECORDS_UPDATE_MODAL_TITLE,
  TRAININGS_MODAL_CANCEL_LABEL,
  TRAININGS_MODAL_UPDATE_LABEL,
} from '~/constants/page.constants'
import type { CreateEngagementRecordPayload } from '~/types/domain/engagement'
import { validateCreateEngagementRecordForm } from '~/utils/engagement-validation'
import { requestCloseForChangedValues, resetFormValues } from '~/utils/form-close-guard'

interface EngagementRecordUpdateFormValues {
  personnel_id: string
  engagement_id: string
  personnel_name: string
  engagement_title: string
  role: string
  location: string
  start_date: string
  end_date: string
  remarks: string
}

const props = withDefaults(
  defineProps<{
    initialValues: EngagementRecordUpdateFormValues
    isSubmitting?: boolean
    warningMessage?: string
    errorMessage?: string
  }>(),
  {
    isSubmitting: false,
    warningMessage: '',
    errorMessage: '',
  },
)

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateEngagementRecordPayload): void
}>()

const form = reactive<EngagementRecordUpdateFormValues>({
  personnel_id: '',
  engagement_id: '',
  personnel_name: '',
  engagement_title: '',
  role: '',
  location: '',
  start_date: '',
  end_date: '',
  remarks: '',
})

const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

watch(
  () => props.initialValues,
  (value) => {
    form.personnel_id = value.personnel_id
    form.engagement_id = value.engagement_id
    form.personnel_name = value.personnel_name
    form.engagement_title = value.engagement_title
    form.role = value.role
    form.location = value.location
    form.start_date = value.start_date
    form.end_date = value.end_date
    form.remarks = value.remarks
  },
  { immediate: true, deep: true },
)

const personnelDisplayName = computed(() => form.personnel_name || '—')
const engagementDisplayName = computed(() => form.engagement_title || '—')

const onSubmit = () => {
  const result = validateCreateEngagementRecordForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}


const onCloseRequest = async () => {
  const shouldClose = await requestCloseForChangedValues({
    formValues: form,
    originalValues: props.initialValues,
    showDialog,
  })

  if (shouldClose) {
    emit('close')
  }
}

const onResetForm = () => {
  resetFormValues(
    form,
    props.initialValues,
  )
}
</script>
