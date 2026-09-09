<template>

</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { AdvancedSearchValue } from '~/constants/ui.constants'
import type { AccountTypeSearchCondition, UserAccountsSearchQuery } from '~/types/domain/users'
import {
  USERS_ACCOUNT_FILTER_CARD_TITLE,
  USERS_ACCOUNT_FILTER_FIELD_OPTIONS,
  USERS_ACCOUNT_FILTER_RESET_LABEL,
} from '~/constants/page.constants'

const props = withDefaults(defineProps<{
  validationErrors?: FieldValidationMap
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})
</script>
