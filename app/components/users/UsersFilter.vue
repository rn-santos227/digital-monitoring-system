<template>
  <BaseAccordion :title="USERS_PROFILE_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="USERS_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="USERS_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="USERS_PROFILE_FILTER_TERM_LABEL"
          :placeholder="USERS_PROFILE_FILTER_TERM_PLACEHOLDER"
          :error="validationErrors.term"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="USERS_PROFILE_FILTER_FIELDS_LABEL"
          :options="profileFilterFieldOptions"
          :error="validationErrors.fields"
        />

        <BaseSelect
          v-model="localValue.status"
          :label="USERS_PROFILE_FILTER_STATUS_LABEL"
          :options="profileFilterStatusOptions"
        />
      </div>

      <footer :class="USERS_FILTER_FOOTER_CLASSES">
        <div :class="USERS_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ USERS_PROFILE_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ USERS_PROFILE_FILTER_RESET_LABEL }}</BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { UserProfilesSearchQuery } from '~/types/domain/users'
import type { FieldValidationMap } from '~/utils/field-validation'
import {
  USERS_PROFILE_FILTER_APPLY_LABEL,
  USERS_PROFILE_FILTER_CARD_TITLE,
  USERS_PROFILE_FILTER_FIELD_OPTIONS,
  USERS_PROFILE_FILTER_FIELDS_LABEL,
  USERS_PROFILE_FILTER_RESET_LABEL,
  USERS_PROFILE_FILTER_STATUS_LABEL,
  USERS_PROFILE_FILTER_STATUS_OPTIONS,
  USERS_PROFILE_FILTER_TERM_LABEL,
  USERS_PROFILE_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  USERS_FILTER_ACTIONS_CLASSES,
  USERS_FILTER_FIELDS_GRID_CLASSES,
  USERS_FILTER_FOOTER_CLASSES,
  USERS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'

interface UsersFilterModel {
  term: string
  fields: string
  status: string
}

const props = withDefaults(defineProps<{
  modelValue: Partial<UserProfilesSearchQuery>
  validationErrors?: FieldValidationMap
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<UserProfilesSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<UsersFilterModel>({
  term: '',
  fields: '',
  status: '',
})

const syncLocalValue = (value: Partial<UserProfilesSearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''

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

const profileFilterFieldOptions = [...USERS_PROFILE_FILTER_FIELD_OPTIONS]
const profileFilterStatusOptions = [...USERS_PROFILE_FILTER_STATUS_OPTIONS]

const emitApply = () => {
  emit('apply', {
    term: localValue.term,
    fields: localValue.fields,
    isActive: localValue.status === 'active' ? true : localValue.status === 'inactive' ? false : undefined,
  })
}

const emitReset = () => {
  emit('reset')
}
</script>
