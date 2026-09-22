<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import {
  EQUIPMENT_ISSUANCES_FILTER_CARD_TITLE,
  EQUIPMENT_ISSUANCES_FILTER_FIELD_OPTIONS,
  EQUIPMENT_ISSUANCES_FILTER_RESET_LABEL,
} from '~/constants/page.constants'
import type { EquipmentIssuanceSearchCondition, EquipmentIssuanceSearchQuery } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{
  modelValue: Partial<EquipmentIssuanceSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<EquipmentIssuanceSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = EQUIPMENT_ISSUANCES_FILTER_FIELD_OPTIONS
</script>
