<template>
  <BaseAccordion :title="COMPANIES_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="UNITS_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="UNITS_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="COMPANIES_FILTER_TERM_LABEL"
          :placeholder="COMPANIES_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="COMPANIES_FILTER_FIELDS_LABEL"
          :options="companyFilterFieldOptions"
          :error="validationErrors.fields"
        />

        <BaseSelect
          v-model="localValue.status"
          :label="COMPANIES_FILTER_STATUS_LABEL"
          :options="companyFilterStatusOptions"
        />

        <BaseTextField
          v-model="localValue.battalionId"
          :label="COMPANIES_FILTER_BATTALION_ID_LABEL"
          :placeholder="COMPANIES_FILTER_BATTALION_ID_PLACEHOLDER"
          :error="validationErrors.battalionId"
        />
      </div>

      <footer :class="UNITS_FILTER_FOOTER_CLASSES">
        <div :class="UNITS_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ COMPANIES_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ COMPANIES_FILTER_RESET_LABEL }}</BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { CompanySearchQuery } from '~/types/domain/units'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  COMPANIES_FILTER_APPLY_LABEL,
  COMPANIES_FILTER_BATTALION_ID_LABEL,
  COMPANIES_FILTER_BATTALION_ID_PLACEHOLDER,
  COMPANIES_FILTER_CARD_TITLE,
  COMPANIES_FILTER_FIELD_OPTIONS,
  COMPANIES_FILTER_FIELDS_LABEL,
  COMPANIES_FILTER_RESET_LABEL,
  COMPANIES_FILTER_STATUS_LABEL,
  COMPANIES_FILTER_STATUS_OPTIONS,
  COMPANIES_FILTER_TERM_LABEL,
  COMPANIES_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  UNITS_FILTER_ACTIONS_CLASSES,
  UNITS_FILTER_FIELDS_GRID_CLASSES,
  UNITS_FILTER_FOOTER_CLASSES,
  UNITS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

interface CompaniesFilterModel {
  term: string
  fields: string
  status: string
  battalionId: string
}

const props = withDefaults(defineProps<{
  modelValue: Partial<CompanySearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<CompanySearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<CompaniesFilterModel>({
  term: '',
  fields: '',
  status: '',
  battalionId: '',
})

const syncLocalValue = (value: Partial<CompanySearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''
  localValue.battalionId = value.battalionId ?? ''

  if (value.isActive === true) {
    localValue.status = 'active'
    return
  }

  if (value.isActive === false) {
    localValue.status = 'inactive'
    return
  }

  localValue.status = ''
}

watch(() => props.modelValue, syncLocalValue, { immediate: true, deep: true })

const companyFilterFieldOptions = [...COMPANIES_FILTER_FIELD_OPTIONS]
const companyFilterStatusOptions = [...COMPANIES_FILTER_STATUS_OPTIONS]

const emitApply = () => {
  emit('apply', {
    term: localValue.term,
    fields: localValue.fields,
    isActive: localValue.status === 'active' ? true : localValue.status === 'inactive' ? false : undefined,
    battalionId: localValue.battalionId,
  })
}

const emitReset = () => {
  emit('reset')
}
</script>
