<template>
  <BaseAccordion :title="USERS_ACCOUNT_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="USERS_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="USERS_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="USERS_ACCOUNT_FILTER_TERM_LABEL"
          :placeholder="USERS_ACCOUNT_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="USERS_ACCOUNT_FILTER_FIELDS_LABEL"
          :options="accountTypeFilterFieldOptions"
          :error="validationErrors.fields"
        />

        <BaseSelect
          v-model="localValue.systemType"
          :label="USERS_ACCOUNT_FILTER_SYSTEM_TYPE_LABEL"
          :options="accountTypeFilterSystemTypeOptions"
        />
      </div>

      <footer :class="USERS_FILTER_FOOTER_CLASSES">
        <div :class="USERS_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ USERS_ACCOUNT_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ USERS_ACCOUNT_FILTER_RESET_LABEL }}</BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { UserAccountsSearchQuery } from '~/types/domain/users'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  USERS_ACCOUNT_FILTER_APPLY_LABEL,
  USERS_ACCOUNT_FILTER_CARD_TITLE,
  USERS_ACCOUNT_FILTER_FIELD_OPTIONS,
  USERS_ACCOUNT_FILTER_FIELDS_LABEL,
  USERS_ACCOUNT_FILTER_RESET_LABEL,
  USERS_ACCOUNT_FILTER_SYSTEM_TYPE_LABEL,
  USERS_ACCOUNT_FILTER_SYSTEM_TYPE_OPTIONS,
  USERS_ACCOUNT_FILTER_TERM_LABEL,
  USERS_ACCOUNT_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  USERS_FILTER_ACTIONS_CLASSES,
  USERS_FILTER_FIELDS_GRID_CLASSES,
  USERS_FILTER_FOOTER_CLASSES,
  USERS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

interface AccountTypesFilterModel {
  term: string
  fields: string
  systemType: string
}

const props = withDefaults(defineProps<{
  modelValue: Partial<UserAccountsSearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<UserAccountsSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<AccountTypesFilterModel>({
  term: '',
  fields: '',
  systemType: '',
})

const syncLocalValue = (value: Partial<UserAccountsSearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''

  if (value.isSystem === true) {
    localValue.systemType = 'system'
    return
  }

  if (value.isSystem === false) {
    localValue.systemType = 'custom'
    return
  }

  localValue.systemType = ''
}

watch(() => props.modelValue, syncLocalValue, { immediate: true, deep: true })

const accountTypeFilterFieldOptions = [...USERS_ACCOUNT_FILTER_FIELD_OPTIONS]
const accountTypeFilterSystemTypeOptions = [...USERS_ACCOUNT_FILTER_SYSTEM_TYPE_OPTIONS]

const emitApply = () => {
  emit('apply', {
    term: localValue.term,
    fields: localValue.fields,
    isSystem: localValue.systemType === 'system' ? true : localValue.systemType === 'custom' ? false : undefined,
  })
}

const emitReset = () => {
  emit('reset')
}
</script>
