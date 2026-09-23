<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import {
  EQUIPMENT_ITEMS_FILTER_CARD_TITLE,
  EQUIPMENT_ITEMS_FILTER_FIELD_OPTIONS,
  EQUIPMENT_ITEMS_FILTER_RESET_LABEL,
} from '~/constants/page.constants'
import type { EquipmentItemSearchCondition, EquipmentItemSearchQuery } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{
  modelValue: Partial<EquipmentItemSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<EquipmentItemSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = EQUIPMENT_ITEMS_FILTER_FIELD_OPTIONS
</script>
