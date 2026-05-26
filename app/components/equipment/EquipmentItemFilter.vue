<template>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
  EQUIPMENT_ITEMS_FILTER_APPLY_LABEL,
  EQUIPMENT_ITEMS_FILTER_CARD_TITLE,
  EQUIPMENT_ITEMS_FILTER_FIELDS_LABEL,
  EQUIPMENT_ITEMS_FILTER_FIELD_OPTIONS,
  EQUIPMENT_ITEMS_FILTER_RESET_LABEL,
  EQUIPMENT_ITEMS_FILTER_TERM_LABEL,
  EQUIPMENT_ITEMS_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  UNITS_FILTER_ACTIONS_CLASSES,
  UNITS_FILTER_FIELDS_GRID_CLASSES,
  UNITS_FILTER_FOOTER_CLASSES,
  UNITS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'
import type { EquipmentItemSearchQuery } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{ modelValue: Partial<EquipmentItemSearchQuery> }>(), {
  modelValue: () => ({}),
})
</script>
