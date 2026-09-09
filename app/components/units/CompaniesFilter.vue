<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { CompanySearchCondition, CompanySearchQuery } from '~/types/domain/units'
import {
  COMPANIES_FILTER_CARD_TITLE,
  COMPANIES_FILTER_FIELD_OPTIONS,
  COMPANIES_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<CompanySearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<CompanySearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = COMPANIES_FILTER_FIELD_OPTIONS.filter(option => option.value)
const conditions = computed<CompanySearchCondition[]>(() => 
  if (!props.modelValue.conditions) {
    return props.modelValue.term
      ? [{
          id: 'legacy-condition',
          field: props.modelValue.fields || fieldOptions[0]?.value || '',
          operator: 'contains',
          value: props.modelValue.term || '',
        }]
      : []
  }
})
</script>
