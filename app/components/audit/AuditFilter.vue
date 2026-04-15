<template>
  <BaseAccordion :title="AUDIT_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="AUDIT_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="AUDIT_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="AUDIT_FILTER_TERM_LABEL"
          :placeholder="AUDIT_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="AUDIT_FILTER_FIELDS_LABEL"
          :options="auditFilterFieldOptions"
          :error="validationErrors.fields"
        />

        <BaseTextField
          v-model="localValue.userName"
          :label="AUDIT_FILTER_USER_LABEL"
          :placeholder="AUDIT_FILTER_USER_PLACEHOLDER"
          :error="validationErrors.userName"
        />

        <BaseDatePicker
          v-model="localValue.startDate"
          :label="AUDIT_FILTER_START_DATE_LABEL"
          :error="validationErrors.startDate"
        />

        <BaseDatePicker
          v-model="localValue.endDate"
          :label="AUDIT_FILTER_END_DATE_LABEL"
          :error="validationErrors.endDate"
        />
      </div>

      <footer :class="AUDIT_FILTER_FOOTER_CLASSES">
        <div :class="AUDIT_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ AUDIT_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ AUDIT_FILTER_RESET_LABEL }}</BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { AuditLogSearchQuery } from '~/types/domain/audit'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  AUDIT_FILTER_APPLY_LABEL,
  AUDIT_FILTER_CARD_TITLE,
  AUDIT_FILTER_END_DATE_LABEL,
  AUDIT_FILTER_FIELD_OPTIONS,
  AUDIT_FILTER_FIELDS_LABEL,
  AUDIT_FILTER_RESET_LABEL,
  AUDIT_FILTER_START_DATE_LABEL,
  AUDIT_FILTER_TERM_LABEL,
  AUDIT_FILTER_TERM_PLACEHOLDER,
  AUDIT_FILTER_USER_LABEL,
  AUDIT_FILTER_USER_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  AUDIT_FILTER_ACTIONS_CLASSES,
  AUDIT_FILTER_FIELDS_GRID_CLASSES,
  AUDIT_FILTER_FOOTER_CLASSES,
  AUDIT_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<AuditLogSearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<AuditLogSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<Partial<AuditLogSearchQuery>>({
  term: '',
  fields: '',
  userName: '',
  startDate: '',
  endDate: '',
})

const syncLocalValue = (value: Partial<AuditLogSearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''
  localValue.userName = value.userName ?? ''
  localValue.startDate = value.startDate ?? ''
  localValue.endDate = value.endDate ?? ''
}

watch(() => props.modelValue, syncLocalValue, { immediate: true, deep: true })

const auditFilterFieldOptions = [...AUDIT_FILTER_FIELD_OPTIONS]

const emitApply = () => {
  emit('apply', {
    term: localValue.term,
    fields: localValue.fields,
    userName: localValue.userName,
    startDate: localValue.startDate,
    endDate: localValue.endDate,
  })
}

const emitReset = () => {
  emit('reset')
}
</script>
