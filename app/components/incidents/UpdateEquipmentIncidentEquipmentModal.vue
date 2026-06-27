<template>
  <BaseModal
    title="Update Incident Equipment"
    description="Change the equipment asset linked to this incident."
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <EquipmentAssetsSuggestionField v-model="form.equipmentAssetId" :error="errors.equipmentAssetId" />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update Equipment</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import EquipmentAssetsSuggestionField from '~/components/general/EquipmentAssetsSuggestionField.vue'
import type { EquipmentIncidentListItem, UpdateEquipmentIncidentEquipmentPayload } from '~/types/domain/incident'
import { validateUpdateEquipmentIncidentEquipmentForm } from '~/utils/incident-validation'

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
  (event: 'submit', payload: UpdateEquipmentIncidentEquipmentPayload): void
}>()

const form = reactive({
  equipmentAssetId: props.incident.equipmentAssetId,
})
const errors = reactive<Record<string, string>>({})

const onSubmit = () => {
  const result = validateUpdateEquipmentIncidentEquipmentForm(form)

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (result.payload) {
    emit('submit', result.payload)
  }
}
</script>
