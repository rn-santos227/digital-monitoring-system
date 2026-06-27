<template>
  <BaseModal
    title="Update Incident Deployment"
    description="Change or clear the deployment record linked to this incident."
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <DeploymentSuggestionField
        v-model="form.deploymentId"
        label="Related deployment"
        helper-text="Leave blank when this incident is not deployment-related."
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update Deployment</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import type { EquipmentIncidentListItem, UpdateEquipmentIncidentDeploymentPayload } from '~/types/domain/incident'
import { validateUpdateEquipmentIncidentDeploymentForm } from '~/utils/incident-validation'

const props = withDefaults(
  defineProps<{
    incident: EquipmentIncidentListItem
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
  (event: 'submit', payload: UpdateEquipmentIncidentDeploymentPayload): void
}>()

const form = reactive({
  deploymentId: props.incident.deploymentId ?? '',
})

const onSubmit = () => {
  const result = validateUpdateEquipmentIncidentDeploymentForm(form)
  emit('submit', result.payload)
}
</script>
