<template>

</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  DEPLOYMENT_RECORDS_FILTER_APPLY_LABEL,
  DEPLOYMENT_RECORDS_FILTER_CARD_TITLE,
  DEPLOYMENT_RECORDS_FILTER_FIELDS_LABEL,
  DEPLOYMENT_RECORDS_FILTER_RESET_LABEL,
  DEPLOYMENT_RECORDS_FILTER_TERM_LABEL,
  DEPLOYMENT_RECORDS_FILTER_TERM_PLACEHOLDER,
  DEPLOYMENTS_FILTER_FIELD_OPTIONS,
} from '~/constants/page.constants'
import {
  DEPLOYMENTS_FILTER_ACTIONS_CLASSES,
  DEPLOYMENTS_FILTER_FIELDS_GRID_CLASSES,
  DEPLOYMENTS_FILTER_FOOTER_CLASSES,
  DEPLOYMENTS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

interface DeploymentRecordsFilterModel {
  term: string
  fields: string
}

interface DeploymentManagementSearchQuery {
  term?: string
  fields?: string
}

const props = withDefaults(defineProps<{
  modelValue: Partial<DeploymentManagementSearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<DeploymentManagementSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<DeploymentRecordsFilterModel>({
  term: '',
  fields: '',
})

watch(() => props.modelValue, (value) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''
}, { immediate: true, deep: true })

const deploymentRecordFilterFieldOptions = [...DEPLOYMENTS_FILTER_FIELD_OPTIONS]

const emitApply = () => {
  emit('apply', {
    term: localValue.term,
    fields: localValue.fields,
  })
}

const emitReset = () => {
  emit('reset')
}
</script>
