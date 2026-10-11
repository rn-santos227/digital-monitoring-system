<template>
  <BaseAccordion :title="DASHBOARD_ADVANCED_PARAMETERS_TITLE">
    <p class="mb-4 text-sm text-slate-600">
      {{ DASHBOARD_ADVANCED_PARAMETERS_DESCRIPTION }}
    </p>
    <form :class="DASHBOARD_DISPLAY_FORM_CLASSES" @submit.prevent="applyParameters">
      <BaseAlert v-if="warningMessage" :message="warningMessage" tone="warning" />
      <BaseAlert v-if="errorMessage" :message="errorMessage" tone="danger" />
      <DashboardDisplayOptions v-model="displayDraft" :disabled="isLoading" />
      <div :class="DASHBOARD_PARAMETER_FIELDS_CLASSES">
        <BaseTextField
          v-for="field in DASHBOARD_PARAMETER_FIELDS"
          :key="field.key"
          v-model="draft[field.key]"
          type="number"
          :label="field.label"
          :helper-text="field.helperText"
          :min="1"
          :max="field.maximum"
          :disabled="!canCustomize || isLoading"
          required
        />
      </div>
      <div :class="DASHBOARD_PARAMETERS_ACTION_CLASSES">
        <BaseButton type="submit" :disabled="!canCustomize || isLoading">
          {{ DASHBOARD_ADVANCED_PARAMETERS_APPLY_LABEL }}
        </BaseButton>
        <BaseButton
          type="button"
          variant="secondary"
          :disabled="!canCustomize || isLoading"
          @click="restoreDefaults"
        >
          {{ DASHBOARD_ADVANCED_PARAMETERS_RESET_LABEL }}
        </BaseButton>
      </div>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import DashboardDisplayOptions from '~/components/dashboard/DashboardDisplayOptions.vue'
import BaseAccordion from '~/components/ui/BaseAccordion.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseTextField from '~/components/ui/BaseTextField.vue'
import {
  DASHBOARD_ADVANCED_PARAMETERS_APPLY_LABEL,
  DASHBOARD_ADVANCED_PARAMETERS_DESCRIPTION,
  DASHBOARD_ADVANCED_PARAMETERS_RESET_LABEL,
  DASHBOARD_ADVANCED_PARAMETERS_TITLE,
  DASHBOARD_PARAMETER_FIELDS,
  DASHBOARD_WIDGET_OPTIONS,
  DASHBOARD_WIDGET_PERMISSIONS,
} from '~/constants/page.constants'
import {
  DASHBOARD_DISPLAY_FORM_CLASSES,
  DASHBOARD_PARAMETER_FIELDS_CLASSES,
  DASHBOARD_PARAMETERS_ACTION_CLASSES,
} from '~/constants/shared.constants'
import type {
  DashboardConfiguration,
  DashboardDisplaySettings,
  DashboardParameters,
} from '~/types/domain/dashboard'
import { useAuthStore } from '~/stores/auth'
import { normalizeDashboardParameters } from '~/utils/dashboard-parameters-storage'
import { normalizeDashboardDisplay } from '~/utils/dashboard-display'

const props = withDefaults(defineProps<{
  modelValue: DashboardParameters
  display: DashboardDisplaySettings
  isLoading?: boolean
  warningMessage?: string
  errorMessage?: string
}>(), { isLoading: false, warningMessage: '', errorMessage: '' })

const emit = defineEmits<{
  (event: 'apply', value: DashboardConfiguration): void
}>()

type DashboardParameterDraft = Record<keyof DashboardParameters, string | number>

const draft = reactive<DashboardParameterDraft>({ ...props.modelValue })
const displayDraft = ref(normalizeDashboardDisplay(props.display))
const authStore = useAuthStore()
const canCustomize = computed(() => DASHBOARD_WIDGET_OPTIONS.some((item) =>
  authStore.hasPermissionAccess(DASHBOARD_WIDGET_PERMISSIONS[item.key]),
))

watch(
  () => props.modelValue,
  (value) => Object.assign(draft, value),
  { deep: true },
)
watch(
  () => props.display,
  (value) => { displayDraft.value = normalizeDashboardDisplay(value) },
  { deep: true },
)

const applyParameters = () => {
  if (!canCustomize.value || props.isLoading) return
  emit('apply', {
    parameters: normalizeDashboardParameters(draft),
    display: normalizeDashboardDisplay(displayDraft.value),
  })
}

const restoreDefaults = () => {
  if (!canCustomize.value || props.isLoading) return
  const initialValue = normalizeDashboardParameters()
  Object.assign(draft, initialValue)
  displayDraft.value = normalizeDashboardDisplay()
  emit('apply', { parameters: initialValue, display: displayDraft.value })
}
</script>
