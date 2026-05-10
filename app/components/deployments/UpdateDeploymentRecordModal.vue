<template>

</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { UpdateDeploymentRecordPayload } from '~/types/domain/deployment'
import { validateUpdateDeploymentRecordForm } from '~/utils/deployment-validation'

const props = withDefaults(defineProps<{
  initialValues: {
    personnelName: string
    operationName: string
    assignmentRole: string
    location: string
    remarks: string
  }
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

const form = reactive<UpdateDeploymentRecordPayload>({
  assignment_role: '',
  location: '',
  remarks: '',
})

watch(() => props.initialValues, (value) => {
  form.assignment_role = value.assignmentRole
  form.location = value.location
  form.remarks = value.remarks
}, { immediate: true, deep: true })

const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateUpdateDeploymentRecordForm({
    assignment_role: form.assignment_role ?? '',
    location: form.location ?? '',
    remarks: form.remarks ?? '',
  })

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}
</script>