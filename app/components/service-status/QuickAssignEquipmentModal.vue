<template>
  <BaseModal
    title="Quick Assign Equipment"
    description="Issue a registered equipment asset to the selected personnel."
    scroll-body
    size="lg"
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert
        v-if="errorMessage"
        tone="danger"
        :message="errorMessage"
      />

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
          v-model="form.issuedByPersonnelId"
          label="Issued by personnel"
          placeholder="Search issuing personnel"
          helper-text="Select the personnel accountable for issuing the equipment."
          :error="errors.issuedByPersonnelId"
        />
        <DeploymentSuggestionField
          v-model="form.deploymentId"
          label="Deployment record"
          placeholder="Search deployment record"
          helper-text="Optionally link this issuance to a deployment record."
          :error="errors.deploymentId"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <BaseSelect
          v-model="form.statusId"
          label="Issuance status"
          placeholder="Select issuance status"
          :options="EQUIPMENT_ISSUANCES_STATUS_OPTIONS"
          :error="errors.statusId"
          required
        />
        <BaseDatePicker
          v-model="form.issueDate"
          label="Issue date"
          :error="errors.issueDate"
          required
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
        <BaseDatePicker
          v-model="form.expectedReturnDate"
          label="Expected return date"
          :min="form.issueDate"
          :error="errors.expectedReturnDate"
        />
        <BaseTextField
          v-model="form.issuedLocation"
          label="Issued location"
          :error="errors.issuedLocation"
        />
      </div>

      <BaseTextArea
        v-model="form.remarks"
        label="Remarks"
        placeholder="Optional equipment assignment remarks"
        :error="errors.remarks"
      />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="onCloseRequest">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Assign</BaseButton>
      </div>
    </template>
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

const props = withDefaults(
  defineProps<{
    personnelId: string
    isSubmitting?: boolean
    errorMessage?: string
  }>(),
  {
    isSubmitting: false,
    errorMessage: '',
  },
)

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'submit', payload: Omit<CreateEquipmentIssuancePayload, 'issuedToPersonnelId'>): void
}>()

const today = new Date().toISOString().slice(0, 10)

const form = reactive({
  equipmentAssetId: '',
  equipmentAssetStatusId: 'Issued',
  issuedToPersonnelId: props.personnelId,
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
  form.issuedToPersonnelId = props.personnelId

  const result = validateCreateEquipmentIssuanceForm(form)

  Object.keys(errors).forEach((key) => {
    delete errors[key]
  })

  Object.assign(errors, result.errors)

  if (!result.payload) {
    return
  }

  emit('submit', {
    equipmentAssetId: result.payload.equipmentAssetId,
    equipmentAssetStatusId: result.payload.equipmentAssetStatusId,
    issuedByPersonnelId: result.payload.issuedByPersonnelId,
    deploymentId: result.payload.deploymentId,
    issueDate: result.payload.issueDate,
    expectedReturnDate: result.payload.expectedReturnDate,
    actualReturnDate: result.payload.actualReturnDate,
    quantityIssued: result.payload.quantityIssued,
    statusId: result.payload.statusId,
    issuedLocation: result.payload.issuedLocation,
    returnLocation: result.payload.returnLocation,
    remarks: result.payload.remarks,
  })
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
