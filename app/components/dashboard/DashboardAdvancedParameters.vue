<template>

</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import BaseAccordion from '~/components/ui/BaseAccordion.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseTextField from '~/components/ui/BaseTextField.vue'
import {
  DASHBOARD_ADVANCED_PARAMETERS_APPLY_LABEL,
  DASHBOARD_ADVANCED_PARAMETERS_DESCRIPTION,
  DASHBOARD_ADVANCED_PARAMETERS_RESET_LABEL,
  DASHBOARD_ADVANCED_PARAMETERS_TITLE,
  DASHBOARD_PARAMETER_FIELDS,
} from '~/constants/page.constants'
import type { DashboardParameters } from '~/types/domain/dashboard'
import {
  normalizeDashboardParameters,
  resetDashboardParameters,
  saveDashboardParameters,
} from '~/utils/dashboard-parameters-storage'

const props = defineProps<{ modelValue: DashboardParameters }>()

const emit = defineEmits<{
  (event: 'apply', value: DashboardParameters): void
}>()

type DashboardParameterDraft = Record<keyof DashboardParameters, string | number>

const draft = reactive<DashboardParameterDraft>({ ...props.modelValue })

watch(
  () => props.modelValue,
  (value) => Object.assign(draft, value),
  { deep: true },
)

const applyParameters = () => {
  emit('apply', saveDashboardParameters(normalizeDashboardParameters(draft)))
}

const restoreDefaults = () => {
  const initialValue = resetDashboardParameters()
}
</script>