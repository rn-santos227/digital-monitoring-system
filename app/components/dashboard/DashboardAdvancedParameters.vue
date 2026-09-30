<template>
  <BaseAccordion :title="DASHBOARD_ADVANCED_PARAMETERS_TITLE">
    <p class="mb-4 text-sm text-slate-600">
      {{ DASHBOARD_ADVANCED_PARAMETERS_DESCRIPTION }}
    </p>
    <form class="grid gap-4 md:grid-cols-2 xl:grid-cols-4" @submit.prevent="applyParameters">
      <BaseTextField
        v-for="field in DASHBOARD_PARAMETER_FIELDS"
        :key="field.key"
        v-model="draft[field.key]"
        type="number"
        :label="field.label"
        :helper-text="field.helperText"
        :min="1"
        :max="field.maximum"
        required
      />
      <div class="flex flex-wrap gap-2 md:col-span-2 xl:col-span-4">
        <BaseButton type="submit">
          {{ DASHBOARD_ADVANCED_PARAMETERS_APPLY_LABEL }}
        </BaseButton>
        <BaseButton type="button" variant="secondary" @click="restoreDefaults">
          {{ DASHBOARD_ADVANCED_PARAMETERS_RESET_LABEL }}
        </BaseButton>
      </div>
    </form>
  </BaseAccordion>
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
  Object.assign(draft, initialValue)
  emit('apply', initialValue)
}
</script>