<template>
  <BaseModal
    title="Create Deployment Record"
    description="Assign personnel to an existing deployment profile."
    size="lg"
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <DeploymentSuggestionField v-model="form.deployment_id" :error="errors.deployment_id" @select="onDeploymentSelected" />
      <PersonnelSuggestionField v-model="form.personnel_id" :error="errors.personnel_id" />
      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField 
          v-model="form.assignment_role"
          label="Assignment Role"
          :error="errors.assignment_role"
        />
        
        <BaseTextField 
          v-model="form.deployment_area"
          label="Deployment Area"
          :error="errors.deployment_area"
        />
        
        <BaseDatePicker
          v-model="form.start_date"
          label="Start Date" 
          :error="errors.start_date"
        />
        
        <BaseDatePicker
          v-model="form.end_date"
          label="End Date" 
          :error="errors.end_date"
        />
      </div>

      <BaseTextArea
        v-model="form.remarks"
        label="Remarks"
        placeholder="Optional deployment remarks"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Create</BaseButton>
      </div>
    </template>
  </BaseModal>
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

const onSubmit = () => {
  const result = validateCreateDeploymentRecordForm(form)

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
