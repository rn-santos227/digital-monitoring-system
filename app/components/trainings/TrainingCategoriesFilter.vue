<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { TrainingCategorySearchCondition, TrainingCategorySearchQuery } from '~/types/domain/training'
import {
  TRAINING_CATEGORIES_FILTER_CARD_TITLE,
  TRAINING_CATEGORIES_FILTER_FIELD_OPTIONS,
  TRAINING_CATEGORIES_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<TrainingCategorySearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<TrainingCategorySearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = TRAINING_CATEGORIES_FILTER_FIELD_OPTIONS
const conditions = computed<TrainingCategorySearchCondition[]>(() => {
  if (!props.modelValue.conditions) {

  }
})
</script>
