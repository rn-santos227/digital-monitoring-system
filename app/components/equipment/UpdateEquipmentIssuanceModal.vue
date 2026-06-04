<template>
  <BaseModal
    title="Update Equipment Issuance"
    description="Update equipment issuance assignment, return, and status details for accountability monitoring."
    scroll-body
    size="lg"
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 md:grid-cols-2">
        <EquipmentAssetsSuggestionField
          v-model="form.equipmentAssetId"
          :error="errors.equipmentAssetId"
        />
        <BaseSelect
          v-model="form.statusId"
          label="Issuance status"
          placeholder="Select issuance status"
          :options="EQUIPMENT_ISSUANCES_STATUS_OPTIONS"
          :error="errors.statusId"
          required
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <PersonnelSuggestionField
          v-model="form.issuedToPersonnelId"
          label="Issued to personnel"
          placeholder="Search receiving personnel"
          helper-text="Select the personnel receiving the equipment."
          :error="errors.issuedToPersonnelId"
        />
        <PersonnelSuggestionField
          v-model="form.issuedByPersonnelId"
          label="Issued by personnel"
          placeholder="Search issuing personnel"
          helper-text="Select the personnel accountable for issuing the equipment."
          :error="errors.issuedByPersonnelId"
        />
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import EquipmentAssetsSuggestionField from '~/components/general/EquipmentAssetsSuggestionField.vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import { useDialog } from '~/composables/useDialog'
import { EQUIPMENT_ISSUANCES_STATUS_OPTIONS } from '~/constants/page.constants'
import type { EquipmentIssuanceFormValues, UpdateEquipmentIssuancePayload } from '~/types/domain/equipment'
import { validateUpdateEquipmentIssuanceForm } from '~/utils/equipment-validation'
import { requestCloseForChangedValues } from '~/utils/form-close-guard'

const props = withDefaults(
  defineProps<{
    initialValues: EquipmentIssuanceFormValues
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
  (event: 'submit', payload: UpdateEquipmentIssuancePayload): void
}>()

const form = reactive<EquipmentIssuanceFormValues>({
  equipmentAssetId: '',
  issuedToPersonnelId: '',
  issuedByPersonnelId: '',
  deploymentId: '',
  issueDate: '',
  expectedReturnDate: '',
  actualReturnDate: '',
  quantityIssued: 1,
  statusId: '',
  issuedLocation: '',
  returnLocation: '',
  remarks: '',
})

watch(
  () => props.initialValues,
  (value) => {
    Object.assign(form, value)
  },
  { immediate: true, deep: true },
)

const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

const quantityIssuedInput = computed({
  get: () => String(form.quantityIssued),
  set: (value: string) => {
    form.quantityIssued = value === '' ? 0 : Number(value)
  },
})

const onSubmit = () => {
  const result = validateUpdateEquipmentIssuanceForm(form)

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}

const onCloseRequest = async () => {
  const shouldClose = await requestCloseForChangedValues({
    formValues: form,
    originalValues: props.initialValues,
    showDialog,
  })

  if (shouldClose) {
    emit('close')
  }
}
</script>
