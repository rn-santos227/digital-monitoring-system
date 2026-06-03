<template>
  <BaseModal
    title="Create Equipment Issuance"
    description="Issue a registered equipment asset to AFP personnel and update the equipment status for accountability monitoring."
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
          v-model="form.equipmentAssetStatusId"
          label="Equipment status"
          placeholder="Select equipment status"
          :options="EQUIPMENT_ASSETS_ASSET_STATUS_OPTIONS"
          :error="errors.equipmentAssetStatusId"
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

      <div class="grid gap-4 md:grid-cols-2">
        <DeploymentSuggestionField
          v-model="form.deploymentId"
          label="Deployment record"
          placeholder="Search deployment record"
          helper-text="Optionally link this issuance to a deployment record."
          :error="errors.deploymentId"
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

      <div class="grid gap-4 md:grid-cols-3">
        <BaseDatePicker v-model="form.issueDate" label="Issue date" :error="errors.issueDate" required />
        <BaseDatePicker
          v-model="form.expectedReturnDate"
          label="Expected return date"
          :min="form.issueDate"
          :error="errors.expectedReturnDate"
        />
        <BaseTextField
          v-model="quantityIssuedInput"
          type="number"
          label="Quantity issued"
          :error="errors.quantityIssued"
          required
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.issuedLocation" label="Issued location" :error="errors.issuedLocation" />
        <BaseTextField v-model="form.returnLocation" label="Return location" :error="errors.returnLocation" />
      </div>

      <BaseTextArea v-model="form.remarks" label="Remarks" :error="errors.remarks" />
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import EquipmentAssetsSuggestionField from '~/components/general/EquipmentAssetsSuggestionField.vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_ASSETS_ASSET_STATUS_OPTIONS,
  EQUIPMENT_ISSUANCES_STATUS_OPTIONS,
} from '~/constants/page.constants'
import type { CreateEquipmentIssuancePayload } from '~/types/domain/equipment'
import { validateCreateEquipmentIssuanceForm } from '~/utils/equipment-validation'
import { requestCloseForRequiredFields } from '~/utils/form-close-guard'

withDefaults(
  defineProps<{
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
  (event: 'submit', payload: CreateEquipmentIssuancePayload): void
}>()

const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  equipmentAssetId: '',
  equipmentAssetStatusId: 'Issued',
  issuedToPersonnelId: '',
  issuedByPersonnelId: '',
  deploymentId: '',
  issueDate: today,
  expectedReturnDate: '',
  actualReturnDate: '',
  quantityIssued: 1,
  statusId: 'Issued',
  issuedLocation: '',
  returnLocation: '',
  remarks: '',
})

const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

const quantityIssuedInput = computed({
  get: () => String(form.quantityIssued),
  set: (value: string) => {
    form.quantityIssued = value === '' ? 0 : Number(value)
  },
})

const onSubmit = () => {
  const result = validateCreateEquipmentIssuanceForm(form)

  Object.keys(errors).forEach((key) => delete errors[key])
  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', result.payload)
}

const onCloseRequest = async () => {
  const shouldClose = await requestCloseForRequiredFields({
    formValues: form,
    showDialog,
  })

  if (shouldClose) {
    emit('close')
  }
}
</script>
