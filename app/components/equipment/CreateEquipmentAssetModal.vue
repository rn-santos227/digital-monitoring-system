<template>
  <BaseModal
    title="Create Equipment Asset"
    description="Register a trackable equipment asset for accountability monitoring."
    scroll-body
    @close="onCloseRequest"
  >
    <form class="space-y-4" @submit.prevent="onSubmit">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.assetTag" label="Asset tag" :error="errors.assetTag" required />
        <EquipmentItemsSuggestionField v-model="form.equipmentItemId" :error="errors.equipmentItemId" />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.serialNo" label="Serial number" :error="errors.serialNo" />
        <BaseTextField v-model="form.batchNo" label="Batch number" :error="errors.batchNo" />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseDatePicker v-model="form.procurementDate" label="Procurement date" :error="errors.procurementDate" />
        <BaseTextField
          v-model="acquisitionCostInput"
          type="number"
          label="Acquisition cost"
          :error="errors.acquisitionCost"
        />
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <BaseTextField v-model="form.fundSource" label="Fund source" :error="errors.fundSource" />
        <BaseTextField v-model="form.currentLocation" label="Current location" :error="errors.currentLocation" />
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <BaseSelect
          v-model="form.conditionStatusId"
          label="Condition status"
          placeholder="Select condition status"
          :options="EQUIPMENT_ASSETS_CONDITION_STATUS_OPTIONS"
          :error="errors.conditionStatusId"
        />
        <BaseSelect
          v-model="form.serviceabilityStatusId"
          label="Serviceability status"
          placeholder="Select serviceability status"
          :options="EQUIPMENT_ASSETS_SERVICEABILITY_STATUS_OPTIONS"
          :error="errors.serviceabilityStatusId"
        />
        <BaseSelect
          v-model="form.assetStatusId"
          label="Asset status"
          placeholder="Select asset status"
          :options="EQUIPMENT_ASSETS_ASSET_STATUS_OPTIONS"
          :error="errors.assetStatusId"
          required
        />
      </div>

      <BaseTextArea v-model="form.remarks" label="Remarks" :error="errors.remarks" />
    </form>

    <template #footer>
      <div class="flex justify-end gap-2">
        <BaseButton variant="ghost" @click="onCloseRequest">Cancel</BaseButton>
        <BaseButton :disabled="isSubmitting" @click="onSubmit">Create</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import EquipmentItemsSuggestionField from '~/components/general/EquipmentItemsSuggestionField.vue'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_ASSETS_ASSET_STATUS_OPTIONS,
  EQUIPMENT_ASSETS_CONDITION_STATUS_OPTIONS,
  EQUIPMENT_ASSETS_SERVICEABILITY_STATUS_OPTIONS,
} from '~/constants/page.constants'
import type { CreateEquipmentAssetPayload } from '~/types/domain/equipment'
import { validateCreateEquipmentAssetForm } from '~/utils/equipment-validation'
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
  (event: 'submit', payload: CreateEquipmentAssetPayload): void
}>()

const form = reactive({
  assetTag: '',
  equipmentItemId: '',
  serialNo: '',
  batchNo: '',
  procurementDate: '',
  acquisitionCost: null as number | null,
  fundSource: '',
  currentLocation: '',
  conditionStatusId: '',
  serviceabilityStatusId: '',
  assetStatusId: 'In Stock',
  remarks: '',
})

const errors = reactive<Record<string, string>>({})
const { showDialog } = useDialog()

const acquisitionCostInput = computed({
  get: () => form.acquisitionCost === null ? '' : String(form.acquisitionCost),
  set: (value: string) => {
    form.acquisitionCost = value === '' ? null : Number(value)
  },
})

const onSubmit = () => {
  const result = validateCreateEquipmentAssetForm(form)

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
