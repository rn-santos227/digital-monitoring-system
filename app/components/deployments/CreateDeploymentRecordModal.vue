<template>

</template>

<script setup lang="ts">
import { reactive } from 'vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import type { CreateDeploymentRecordPayload } from '~/types/domain/deployment'
import { validateCreateDeploymentRecordForm } from '~/utils/deployment-validation'
import type { DeploymentManagementListItem } from '~/types/domain/deployment'

withDefaults(defineProps<{ isSubmitting?: boolean }>(), {
  isSubmitting: false,
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: CreateDeploymentRecordPayload): void
}>()

const form = reactive<CreateDeploymentRecordPayload>({
  deployment_id: '',
  personnel_id: '',
  assignment_role: '',
  deployment_area: '',
  start_date: '',
  end_date: '',
  remarks: '',
})

const errors = reactive<Record<string, string>>({})

const onDeploymentSelected = (deployment: DeploymentManagementListItem | null) => {
  if (!deployment) {
    return
  }

  form.assignment_role = deployment.assignmentRole ?? ''
  form.deployment_area = deployment.deploymentArea ?? ''
  form.start_date = deployment.startDate ?? ''
  form.end_date = deployment.endDate ?? ''
}
</script>
