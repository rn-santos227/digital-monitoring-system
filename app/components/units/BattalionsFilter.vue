<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { BattalionSearchCondition, BattalionSearchQuery } from '~/types/domain/units'
import {
  BATTALIONS_FILTER_CARD_TITLE,
  BATTALIONS_FILTER_FIELD_OPTIONS,
  BATTALIONS_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<BattalionSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<BattalionSearchQuery>): void
  (event: 'reset'): void
}>()

const localValue = reactive<BattalionsFilterModel>({
  term: '',
  fields: '',
  status: '',
})

const syncLocalValue = (value: Partial<BattalionSearchQuery>) => {
  localValue.term = value.term ?? ''
  localValue.fields = value.fields ?? ''

  if (value.isActive === true) {
    localValue.status = 'active'
    return
  }

  if (value.isActive === false) {
    localValue.status = 'inactive'
    return
  }

  localValue.status = ''
}

watch(() => props.modelValue, syncLocalValue, { immediate: true, deep: true })

const battalionFilterFieldOptions = [...BATTALIONS_FILTER_FIELD_OPTIONS]
const battalionFilterStatusOptions = [...BATTALIONS_FILTER_STATUS_OPTIONS]

const emitApply = () => {
  emit('apply', {
    term: localValue.term,
    fields: localValue.fields,
    isActive: localValue.status === 'active' ? true : localValue.status === 'inactive' ? false : undefined,
  })
}

const emitReset = () => {
  emit('reset')
}
</script>
