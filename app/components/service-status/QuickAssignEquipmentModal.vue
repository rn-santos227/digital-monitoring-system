<template>
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
