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
</script>
