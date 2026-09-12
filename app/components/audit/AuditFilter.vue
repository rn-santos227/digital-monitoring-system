<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchCondition, AdvancedSearchValue } from '~/constants/ui.constants'
import type { AuditLogSearchQuery } from '~/types/domain/audit'
import {
  AUDIT_FILTER_CARD_TITLE,
  AUDIT_FILTER_FIELD_OPTIONS,
  AUDIT_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  modelValue: Partial<AuditLogSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<AuditLogSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = AUDIT_FILTER_FIELD_OPTIONS.filter(option => option.value)
</script>