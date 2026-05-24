<template>
  <BaseAccordion :title="EQUIPMENT_CATEGORIES_FILTER_CARD_TITLE" :initially-open="true">
    <form :class="UNITS_FILTER_FORM_CLASSES" @submit.prevent="emitApply">
      <div :class="UNITS_FILTER_FIELDS_GRID_CLASSES">
        <BaseTextField
          v-model="localValue.term"
          type="search"
          :label="EQUIPMENT_CATEGORIES_FILTER_TERM_LABEL"
          :placeholder="EQUIPMENT_CATEGORIES_FILTER_TERM_PLACEHOLDER"
        />

        <BaseSelect
          v-model="localValue.fields"
          :label="EQUIPMENT_CATEGORIES_FILTER_FIELDS_LABEL"
          :options="fieldOptions"
        />

        <BaseSelect
          v-model="localValue.status"
          :label="EQUIPMENT_CATEGORIES_FILTER_STATUS_LABEL"
          :options="statusOptions"
        />
      </div>

      <footer :class="UNITS_FILTER_FOOTER_CLASSES">
        <div :class="UNITS_FILTER_ACTIONS_CLASSES">
          <BaseButton type="submit" size="sm">{{ EQUIPMENT_CATEGORIES_FILTER_APPLY_LABEL }}</BaseButton>
          <BaseButton type="button" variant="secondary" size="sm" @click="emit('reset')">
            {{ EQUIPMENT_CATEGORIES_FILTER_RESET_LABEL }}
          </BaseButton>
        </div>
      </footer>
    </form>
  </BaseAccordion>
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

const localValue = reactive({ term: '', fields: '', status: '' })

watch(
  () => props.modelValue,
  (value) => {
    localValue.term = value.term ?? ''
    localValue.fields = value.fields ?? ''
    localValue.status = value.isActive === true ? 'active' : value.isActive === false ? 'inactive' : ''
  },
  { immediate: true, deep: true },
)

const fieldOptions = [...EQUIPMENT_CATEGORIES_FILTER_FIELD_OPTIONS]
const statusOptions = [...EQUIPMENT_CATEGORIES_FILTER_STATUS_OPTIONS]

const emitApply = () => {
  emit('apply', {
    term: localValue.term,
    fields: localValue.fields,
    isActive: localValue.status === 'active' ? true : localValue.status === 'inactive' ? false : undefined,
  })
}
</script>
