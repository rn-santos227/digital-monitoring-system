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
</script>
