<template>

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
</script>
