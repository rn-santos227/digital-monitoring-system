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
</script>
