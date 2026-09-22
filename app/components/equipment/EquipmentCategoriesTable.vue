<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import {
  EQUIPMENT_CATEGORIES_FILTER_CARD_TITLE,
  EQUIPMENT_CATEGORIES_FILTER_FIELD_OPTIONS,
  EQUIPMENT_CATEGORIES_FILTER_RESET_LABEL,
} from '~/constants/page.constants'
import type { EquipmentCategorySearchCondition, EquipmentCategorySearchQuery } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{
  modelValue: Partial<EquipmentCategorySearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const isModalOpen = ref(false)
const fieldOptions = EQUIPMENT_CATEGORIES_FILTER_FIELD_OPTIONS
const conditions = computed<EquipmentCategorySearchCondition[]>(() => {
  if (!props.modelValue.conditions) {
    return props.modelValue.term
      ? [{
          id: 'legacy-condition',
          field: props.modelValue.fields || fieldOptions[0]?.value || '',
          operator: 'contains',
          value: props.modelValue.term,
        }]
      : []
  }
  try {
    const parsed: unknown = JSON.parse(props.modelValue.conditions)
    return Array.isArray(parsed) ? parsed as EquipmentCategorySearchCondition[] : []
  } catch {
    return []
  }
})
const activeConditionCount = computed(() => conditions.value.length)
const conditionSummary = computed(() => activeConditionCount.value
  ? `${activeConditionCount.value} advanced search condition${activeConditionCount.value === 1 ? '' : 's'} applied`
  : 'No advanced search conditions applied')

</script>
