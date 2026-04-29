<template>
  <BaseAccordion :title="DEPLOYMENTS_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="DEPLOYMENTS_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="DEPLOYMENTS_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="DEPLOYMENTS_FILTER_TERM_LABEL"
          :placeholder="DEPLOYMENTS_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="DEPLOYMENTS_FILTER_FIELDS_LABEL"
          :options="deploymentFilterFieldOptions"
          :error="validationErrors.fields"
        />
      </div>

      <footer :class="DEPLOYMENTS_FILTER_FOOTER_CLASSES">
        <div :class="DEPLOYMENTS_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ DEPLOYMENTS_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ DEPLOYMENTS_FILTER_RESET_LABEL }}</BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  DEPLOYMENTS_FILTER_APPLY_LABEL,
  DEPLOYMENTS_FILTER_CARD_TITLE,
  DEPLOYMENTS_FILTER_FIELD_OPTIONS,
  DEPLOYMENTS_FILTER_FIELDS_LABEL,
  DEPLOYMENTS_FILTER_RESET_LABEL,
  DEPLOYMENTS_FILTER_TERM_LABEL,
  DEPLOYMENTS_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  DEPLOYMENTS_FILTER_ACTIONS_CLASSES,
  DEPLOYMENTS_FILTER_FIELDS_GRID_CLASSES,
  DEPLOYMENTS_FILTER_FOOTER_CLASSES,
  DEPLOYMENTS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

interface DeploymentsFilterModel {
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

const localValue = reactive<DeploymentsFilterModel>({
  term: '',
  fields: '',
})

const syncLocalValue = (value: Partial<DeploymentManagementSearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''
}

watch(() => props.modelValue, syncLocalValue, { immediate: true, deep: true })

const deploymentFilterFieldOptions = [...DEPLOYMENTS_FILTER_FIELD_OPTIONS]

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
