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

</script>