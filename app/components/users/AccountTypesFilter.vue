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
  modelValue: Partial<UserAccountsSearchQuery>
  validationErrors?: Readonly<Record<string, string>>
}>(), {
  modelValue: () => ({}),
  validationErrors: () => ({}),
})

const emit = defineEmits<{
  (event: 'apply', value: Partial<UserAccountsSearchQuery>): void
  (event: 'reset'): void
}>()

const isModalOpen = ref(false)
const fieldOptions = USERS_ACCOUNT_FILTER_FIELD_OPTIONS.filter(option => option.value)
const conditions = computed<AccountTypeSearchCondition[]>(() => {

})
</script>
