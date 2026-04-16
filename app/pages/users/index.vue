<template>

</template>

<script setup lang="ts">
import {
  USERS_ACCOUNT_TABLE_COLUMNS,
  USERS_ACCOUNT_TABLE_EMPTY_MESSAGE,
  USERS_ACCOUNT_TABLE_SEARCH_PLACEHOLDER,
  USERS_ACCOUNT_TABLE_TITLE,
  USERS_PAGE_SECTION_CLASSES,
  USERS_PAGE_SUBTITLE,
  USERS_PAGE_TAB_ITEMS,
  USERS_PAGE_TABS_ARIA_LABEL,
  USERS_PAGE_TITLE,
  USERS_PROFILE_TABLE_COLUMNS,
  USERS_PROFILE_TABLE_EMPTY_MESSAGE,
  USERS_PROFILE_TABLE_SEARCH_PLACEHOLDER,
  USERS_PROFILE_TABLE_TITLE,
} from '~/constants/page.constants'
import { USERS_PAGE_HEADER_CLASSES } from '~/constants/shared.constants'
import { useUsers } from '~/composables/useUsers'
import { useUsersPageHandlers } from '~/handlers'

const {
  activeTab,
  profileSearchQuery,
  accountSearchQuery,
  profileTableRows,
  accountTableRows,
  profilePagination,
  accountPagination,
  isLoading,
  error,
  loadUserProfiles,
  loadUserAccounts,
} = useUsers()

</script>