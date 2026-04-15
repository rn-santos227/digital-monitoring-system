<template>
  <section class="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <header class="mb-4">
      <h2 class="text-lg font-semibold text-slate-900">{{ AUDIT_FILTER_CARD_TITLE }}</h2>
    </header>

    <form class="grid gap-3 md:grid-cols-2 lg:grid-cols-3" @submit.prevent="emitApply">
      <BaseTextField
        v-model="localValue.term"
        type="search"
        :label="AUDIT_FILTER_TERM_LABEL"
        :placeholder="AUDIT_FILTER_TERM_PLACEHOLDER"
      />

      <BaseSelect
        v-model="localValue.fields"
        :label="AUDIT_FILTER_FIELDS_LABEL"
        :options="auditFilterFieldOptions"
      />

      <BaseTextField
        v-model="localValue.userName"
        :label="AUDIT_FILTER_USER_LABEL"
        :placeholder="AUDIT_FILTER_USER_PLACEHOLDER"
      />

      <BaseDatePicker
        v-model="localValue.startDate"
        :label="AUDIT_FILTER_START_DATE_LABEL"
      />

      <BaseDatePicker
        v-model="localValue.endDate"
        :label="AUDIT_FILTER_END_DATE_LABEL"
      />

      <div class="flex items-end gap-2">
        <BaseButton type="submit" size="sm">{{ AUDIT_FILTER_APPLY_LABEL }}</BaseButton>
        <BaseButton type="button" variant="secondary" size="sm" @click="emitReset">{{ AUDIT_FILTER_RESET_LABEL }}</BaseButton>
      </div>
    </form>
  </section>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { AuditLogSearchQuery } from '~/types/domain/audit'
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

const props = withDefaults(defineProps<{
  modelValue: Partial<AuditLogSearchQuery>
}>(), {
  modelValue: () => ({})
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
