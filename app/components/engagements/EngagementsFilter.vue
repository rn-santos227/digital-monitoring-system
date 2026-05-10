<template>
  <BaseAccordion :title="ENGAGEMENTS_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="DEPLOYMENTS_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="DEPLOYMENTS_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="ENGAGEMENTS_FILTER_TERM_LABEL"
          :placeholder="ENGAGEMENTS_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="ENGAGEMENTS_FILTER_FIELDS_LABEL"
          :options="engagementFilterFieldOptions"
          :error="validationErrors.fields"
        />
      </div>

      <footer :class="DEPLOYMENTS_FILTER_FOOTER_CLASSES">
        <div :class="DEPLOYMENTS_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ ENGAGEMENTS_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">
            {{ ENGAGEMENTS_FILTER_RESET_LABEL }}
          </BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
  ENGAGEMENTS_FILTER_APPLY_LABEL,
  ENGAGEMENTS_FILTER_CARD_TITLE,
  ENGAGEMENTS_FILTER_FIELDS_LABEL,
  ENGAGEMENTS_FILTER_FIELD_OPTIONS,
  ENGAGEMENTS_FILTER_RESET_LABEL,
  ENGAGEMENTS_FILTER_TERM_LABEL,
  ENGAGEMENTS_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  DEPLOYMENTS_FILTER_ACTIONS_CLASSES,
  DEPLOYMENTS_FILTER_FIELDS_GRID_CLASSES,
  DEPLOYMENTS_FILTER_FOOTER_CLASSES,
  DEPLOYMENTS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'
import type { EngagementManagementSearchQuery } from '~/types/domain/engagement'
import type { FieldValidationMap } from '~/utils/field-validation'

const props = withDefaults(defineProps<{
  modelValue: Partial<EngagementManagementSearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<EngagementManagementSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive({ term: '', fields: '' })

watch(() => props.modelValue, (value) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''
}, { immediate: true, deep: true })

const engagementFilterFieldOptions = [...ENGAGEMENTS_FILTER_FIELD_OPTIONS]

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
