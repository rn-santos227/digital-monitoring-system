<template>

</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
  EQUIPMENT_CATEGORIES_FILTER_APPLY_LABEL,
  EQUIPMENT_CATEGORIES_FILTER_CARD_TITLE,
  EQUIPMENT_CATEGORIES_FILTER_FIELDS_LABEL,
  EQUIPMENT_CATEGORIES_FILTER_FIELD_OPTIONS,
  EQUIPMENT_CATEGORIES_FILTER_RESET_LABEL,
  EQUIPMENT_CATEGORIES_FILTER_STATUS_LABEL,
  EQUIPMENT_CATEGORIES_FILTER_STATUS_OPTIONS,
  EQUIPMENT_CATEGORIES_FILTER_TERM_LABEL,
  EQUIPMENT_CATEGORIES_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  UNITS_FILTER_ACTIONS_CLASSES,
  UNITS_FILTER_FIELDS_GRID_CLASSES,
  UNITS_FILTER_FOOTER_CLASSES,
  UNITS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'
import type { EquipmentCategorySearchQuery } from '~/types/domain/equipment'


const props = withDefaults(defineProps<{ modelValue: Partial<EquipmentCategorySearchQuery> }>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<EquipmentCategorySearchQuery>): void
  (event: 'reset'): void
}>()


</script>