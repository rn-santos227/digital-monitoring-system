<template>

</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import DeploymentSuggestionField from '~/components/general/DeploymentSuggestionField.vue'
import EquipmentAssetsSuggestionField from '~/components/general/EquipmentAssetsSuggestionField.vue'
import PersonnelSuggestionField from '~/components/general/PersonnelSuggestionField.vue'
import { useDialog } from '~/composables/useDialog'
import {
  EQUIPMENT_INCIDENTS_INCIDENT_TYPE_OPTIONS,
  EQUIPMENT_INCIDENTS_INVESTIGATION_STATUS_OPTIONS,
} from '~/constants/page.constants'
import type { SelectOption } from '~/types/domain/misc'
import type { CreateEquipmentIncidentPayload } from '~/types/domain/incident'
import { getIncidentTypeSuggestionsEndpoint, getInvestigationStatusSuggestionsEndpoint } from '~/utils/incident-endpoints'
import { validateCreateEquipmentIncidentForm } from '~/utils/incident-validation'
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
</script>
