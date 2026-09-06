<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { PersonnelSearchCondition, PersonnelSearchQuery } from '~/types/domain/personnel'
import {
  PERSONNEL_FILTER_CARD_TITLE,
  PERSONNEL_FILTER_FIELD_OPTIONS,
  PERSONNEL_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<PersonnelSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<PersonnelSearchQuery>): void
  (event: 'reset'): void
}>()
</script>
