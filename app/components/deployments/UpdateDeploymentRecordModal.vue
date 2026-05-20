<template>
  <BaseModal
    title="Update Deployment Record"
    description="Update deployment record details."
    size="xl"
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField :model-value="initialValues.personnelName" label="Personnel" disabled />
        <BaseTextField :model-value="initialValues.operationName" label="Deployment" disabled />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.assignment_role" label="Assignment Role" :error="errors.assignment_role" />
        <BaseDatePicker v-model="form.start_date" label="Start Date" :error="errors.start_date" />
        <BaseDatePicker v-model="form.end_date" label="End Date" :error="errors.end_date" />
      </div>

      <BaseTextArea v-model="form.remarks" label="Remarks" :error="errors.remarks" />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="onResetForm">Reset</BaseButton>
        <BaseButton variant="ghost" @click="onCloseRequest">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useDialog } from '~/composables/useDialog'
import type { UpdateDeploymentRecordPayload } from '~/types/domain/deployment'

import type { DeploymentRecordFormValues } from '~/types/domain/deployment'

const props = withDefaults(defineProps<{
  initialValues: DeploymentRecordFormValues
  isSubmitting?: boolean
  errorMessage?: string
}>(), {
  isSubmitting: false,
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: UpdateDeploymentRecordPayload): void
}>()

interface UpdateDeploymentRecordForm {
  assignment_role: string
  start_date: string
  end_date: string
  remarks: string
}

const form = reactive<UpdateDeploymentRecordForm>({
  assignment_role: '',
  start_date: '',
  end_date: '',
  remarks: '',
})

watch(() => props.initialValues, (value) => {
  form.assignment_role = value.assignmentRole
  form.start_date = value.startDate
  form.end_date = value.endDate
  form.remarks = value.remarks
}, { immediate: true, deep: true })


const errors = reactive<Record<string, string>>({})

const { showDialog } = useDialog()

const onSubmit = () => {
  Object.keys(errors).forEach((key) => { delete errors[key] })
  if (!form.start_date.trim()) {
    errors.start_date = 'Start date is required.'
    return
  }
  if (form.end_date && form.end_date < form.start_date) {
    errors.end_date = 'End date cannot be earlier than start date.'
    return
  }
  emit('submit', {
    assignment_role: form.assignment_role.trim() || null,
    start_date: form.start_date.trim(),
    end_date: form.end_date.trim() || null,
    remarks: form.remarks.trim() || null,
  })
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
