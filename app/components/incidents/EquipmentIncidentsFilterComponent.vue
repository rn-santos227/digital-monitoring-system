<template>
  <BaseAccordion :title="EQUIPMENT_INCIDENTS_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="UNITS_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="UNITS_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField v-model="localValue.term" type="search" :label="EQUIPMENT_INCIDENTS_FILTER_TERM_LABEL" :placeholder="EQUIPMENT_INCIDENTS_FILTER_TERM_PLACEHOLDER" />
        <BaseDatePicker v-model="localValue.dateFrom" :label="EQUIPMENT_INCIDENTS_FILTER_DATE_FROM_LABEL" />
        <BaseDatePicker v-model="localValue.dateTo" :label="EQUIPMENT_INCIDENTS_FILTER_DATE_TO_LABEL" />
      </div>
      <footer :class="UNITS_FILTER_FOOTER_CLASSES">
        <div :class="UNITS_FILTER_ACTIONS_CLASSES">
        
        </div>
      </footer>
    </form>
  </BaseAccordion>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import {
  EQUIPMENT_INCIDENTS_FILTER_APPLY_LABEL,
  EQUIPMENT_INCIDENTS_FILTER_CARD_TITLE,
  EQUIPMENT_INCIDENTS_FILTER_DATE_FROM_LABEL,
  EQUIPMENT_INCIDENTS_FILTER_DATE_TO_LABEL,
  EQUIPMENT_INCIDENTS_FILTER_RESET_LABEL,
  EQUIPMENT_INCIDENTS_FILTER_TERM_LABEL,
  EQUIPMENT_INCIDENTS_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  UNITS_FILTER_ACTIONS_CLASSES,
  UNITS_FILTER_FIELDS_GRID_CLASSES,
  UNITS_FILTER_FOOTER_CLASSES,
  UNITS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'
import type { EquipmentIncidentSearchQuery } from '~/types/domain/incident'

const props = withDefaults(defineProps<{ modelValue: Partial<EquipmentIncidentSearchQuery> }>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<EquipmentIncidentSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive({ term: '', dateFrom: '', dateTo: '' })
watch(() => props.modelValue, (value) => {
  localValue.term = value.term ?? ''
  localValue.dateFrom = value.dateFrom ?? ''
  localValue.dateTo = value.dateTo ?? ''
}, { immediate: true, deep: true })

const emitApply = () => emit('apply', {
  term: localValue.term,
  dateFrom: localValue.dateFrom,
  dateTo: localValue.dateTo,
})
</script>
