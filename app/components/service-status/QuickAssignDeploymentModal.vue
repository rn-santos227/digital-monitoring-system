<template>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
import BaseAlert from '~/components/ui/BaseAlert.vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import type { CreateDeploymentRecordPayload, DeploymentManagementListItem } from '~/types/domain/deployment'
import { validateQuickAssignDeploymentForm } from '~/utils/service-status-validation'

withDefaults(defineProps<{ isSubmitting?: boolean; errorMessage?: string }>(), {
  isSubmitting: false,
  errorMessage: '',
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: Omit<CreateDeploymentRecordPayload, 'personnel_id'>): void
}>()

const form = reactive({
  deployment_id: '',
  personnel_id: '',
  assignment_role: '',
  deployment_area: '',
  deployment_area_latitude: '',
  deployment_area_longitude: '',
  start_date: '',
  end_date: '',
  remarks: '',
})

</script>
