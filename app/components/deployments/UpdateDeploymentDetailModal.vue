<template>
  <BaseModal
    :title="DEPLOYMENTS_UPDATE_MODAL_TITLE"
    :description="DEPLOYMENTS_UPDATE_MODAL_DESCRIPTION"
    size="xl"
    @close="onCloseRequest"
  >
    <form :class="DEPLOYMENTS_CREATE_MODAL_FORM_CLASSES" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div :class="DEPLOYMENTS_CREATE_MODAL_FORM_PANE_CLASSES">
        <BaseTextField
          v-model="form.assignmentRole"
          :label="DEPLOYMENTS_CREATE_ASSIGNMENT_ROLE_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_ASSIGNMENT_ROLE_PLACEHOLDER"
          :error="errors.assignmentRole"
        />
        <BaseTextField
          v-model="form.operationName"
          :label="DEPLOYMENTS_CREATE_OPERATION_NAME_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_OPERATION_NAME_PLACEHOLDER"
          :error="errors.operationName"
        />
        <BaseSelect
          v-model="form.statusId"
          :label="DEPLOYMENTS_CREATE_STATUS_ID_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_STATUS_ID_PLACEHOLDER"
          :options="DEPLOYMENTS_CREATE_STATUS_OPTIONS"
          :error="errors.statusId"
          required
        />

        <div class="grid gap-4 md:grid-cols-2">
          <BaseDatePicker v-model="form.startDate" :label="DEPLOYMENTS_CREATE_START_DATE_LABEL" :error="errors.startDate" />
          <BaseDatePicker v-model="form.endDate" :label="DEPLOYMENTS_CREATE_END_DATE_LABEL" :error="errors.endDate" />
        </div>

        <PersonnelSuggestionField
          v-model="form.supervisorId"
          :label="DEPLOYMENTS_CREATE_SUPERVISOR_ID_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_SUPERVISOR_ID_PLACEHOLDER"
          :error="errors.supervisorId"
        />
        <BaseTextArea
          v-model="form.defaultRemarks"
          :label="DEPLOYMENTS_CREATE_REMARKS_LABEL"
          :placeholder="DEPLOYMENTS_CREATE_REMARKS_PLACEHOLDER"
          :error="errors.defaultRemarks"
        />
      </div>
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
import { reactive, watch } from 'vue'
import { useDialog } from '~/composables/useDialog'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import {
  DEPLOYMENTS_CREATE_ASSIGNMENT_ROLE_LABEL,
  DEPLOYMENTS_CREATE_ASSIGNMENT_ROLE_PLACEHOLDER,
  DEPLOYMENTS_CREATE_END_DATE_LABEL,
  DEPLOYMENTS_CREATE_OPERATION_NAME_LABEL,
  DEPLOYMENTS_CREATE_OPERATION_NAME_PLACEHOLDER,
  DEPLOYMENTS_CREATE_REMARKS_LABEL,
  DEPLOYMENTS_CREATE_REMARKS_PLACEHOLDER,
  DEPLOYMENTS_CREATE_START_DATE_LABEL,
  DEPLOYMENTS_CREATE_STATUS_ID_LABEL,
  DEPLOYMENTS_CREATE_STATUS_ID_PLACEHOLDER,
  DEPLOYMENTS_CREATE_STATUS_OPTIONS,
  DEPLOYMENTS_CREATE_SUPERVISOR_ID_LABEL,
  DEPLOYMENTS_CREATE_SUPERVISOR_ID_PLACEHOLDER,
  DEPLOYMENTS_UPDATE_MODAL_DESCRIPTION,
  DEPLOYMENTS_UPDATE_MODAL_TITLE,
  TRAININGS_MODAL_CANCEL_LABEL,
  TRAININGS_MODAL_UPDATE_LABEL,
} from '~/constants/page.constants'
import { DEPLOYMENTS_CREATE_MODAL_FORM_CLASSES, DEPLOYMENTS_CREATE_MODAL_FORM_PANE_CLASSES } from '~/constants/shared.constants'
import type { CreateDeploymentPayload } from '~/types/domain/deployment'
import { validateCreateDeploymentForm } from '~/utils/deployment-validation'
import { requestCloseForChangedValues, resetFormValues } from '~/utils/form-close-guard'

interface DeploymentFormValues {
  deploymentArea: string
  assignmentRole: string
  deploymentAreaLatitude: string
  deploymentAreaLongitude: string
  operationName: string
  startDate: string
  endDate: string
  statusId: string
  location: string
  supervisorId: string
  defaultRemarks: string
}

const props = withDefaults(defineProps<{
  initialValues: DeploymentFormValues
  isSubmitting?: boolean
  warningMessage?: string
  errorMessage?: string
}>(), {
  isSubmitting: false,
  warningMessage: '',
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateDeploymentPayload): void
}>()

const form = reactive<DeploymentFormValues>({ ...props.initialValues })
const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

watch(() => props.initialValues, (nextValues) => {
  Object.assign(form, nextValues)
}, { deep: true })

const onSubmit = () => {
  const result = validateCreateDeploymentForm(form)
  Object.keys(errors).forEach(key => delete errors[key])
  Object.assign(errors, result.errors)

  if (result.payload) {
    emit('submit', result.payload)
  }
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
