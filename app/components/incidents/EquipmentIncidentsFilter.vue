<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import {
  EQUIPMENT_INCIDENTS_FILTER_CARD_TITLE,
  EQUIPMENT_INCIDENTS_FILTER_FIELD_OPTIONS,
  EQUIPMENT_INCIDENTS_FILTER_RESET_LABEL,
} from '~/constants/page.constants'
import type {
  EquipmentIncidentSearchCondition,
  EquipmentIncidentSearchQuery,
} from '~/types/domain/incident'

const props = withDefaults(defineProps<{
  modelValue: Partial<EquipmentIncidentSearchQuery>
}>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<EquipmentIncidentSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = EQUIPMENT_INCIDENTS_FILTER_FIELD_OPTIONS
</script>
