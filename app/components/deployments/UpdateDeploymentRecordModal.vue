<template>

</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
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
</script>
