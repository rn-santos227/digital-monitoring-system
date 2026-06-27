<template>
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
