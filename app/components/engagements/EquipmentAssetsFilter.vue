<template>

</template>

<script lang="ts">
import { reactive, watch } from 'vue'
import {
  EQUIPMENT_ASSETS_FILTER_APPLY_LABEL,
  EQUIPMENT_ASSETS_FILTER_CARD_TITLE,
  EQUIPMENT_ASSETS_FILTER_FIELDS_LABEL,
  EQUIPMENT_ASSETS_FILTER_FIELD_OPTIONS,
  EQUIPMENT_ASSETS_FILTER_RESET_LABEL,
  EQUIPMENT_ASSETS_FILTER_TERM_LABEL,
  EQUIPMENT_ASSETS_FILTER_TERM_PLACEHOLDER,
} from '~/constants/page.constants'
import {
  UNITS_FILTER_ACTIONS_CLASSES,
  UNITS_FILTER_FIELDS_GRID_CLASSES,
  UNITS_FILTER_FOOTER_CLASSES,
  UNITS_FILTER_FORM_CLASSES,
} from '~/constants/shared.constants'
import type { EquipmentAssetSearchQuery } from '~/types/domain/equipment'

const props = withDefaults(defineProps<{ modelValue: Partial<EquipmentAssetSearchQuery> }>(), {
  modelValue: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<EquipmentAssetSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive({ term: '', fields: '' })
watch(() => props.modelValue, (value) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''
}, { immediate: true, deep: true })

const fieldOptions = [...EQUIPMENT_ASSETS_FILTER_FIELD_OPTIONS]
const emitApply = () => emit('apply', { term: localValue.term, fields: localValue.fields })
</script>