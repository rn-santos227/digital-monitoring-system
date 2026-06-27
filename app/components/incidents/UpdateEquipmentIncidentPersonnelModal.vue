<template>
  <BaseModal
    title="Update Incident Personnel"
    description="Change or clear the personnel member linked to this incident."
    @close="emit('close')"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <PersonnelSuggestionField
        v-model="form.personnelId"
        label="Related personnel"
        helper-text="Leave blank when no personnel member is involved."
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="emit('close')">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Update Personnel</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import type { EquipmentIncidentListItem, UpdateEquipmentIncidentPersonnelPayload } from '~/types/domain/incident'
import { validateUpdateEquipmentIncidentPersonnelForm } from '~/utils/incident-validation'

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
  (event: 'submit', payload: UpdateEquipmentIncidentPersonnelPayload): void
}>()

const form = reactive({
  personnelId: props.incident.personnelId ?? '',
})

const onSubmit = () => {
  const result = validateUpdateEquipmentIncidentPersonnelForm(form)
  emit('submit', result.payload)
}
</script>
