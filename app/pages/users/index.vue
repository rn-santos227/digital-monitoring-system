<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <section :class="USERS_PAGE_SECTION_CLASSES">
      <header :class="USERS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ USERS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ USERS_PAGE_SUBTITLE }}</p>
      </header>


    </section>
  </main>
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

const { handleTabChange, handleProfileSearch, handleAccountSearch } = useUsersPageHandlers(
  activeTab,
  profileSearchQuery,
  accountSearchQuery
)

const onTabChange = (nextTab: string) => {
  handleTabChange(nextTab)
}

const onProfileSearch = (value: string) => {
  handleProfileSearch(value)
  void loadUserProfiles(1, value)
}

const onAccountSearch = (value: string) => {
  handleAccountSearch(value)
  void loadUserAccounts(1, value)
}

const onProfilePageChange = (nextPage: number) => {
  void loadUserProfiles(nextPage)
}

const onAccountPageChange = (nextPage: number) => {
  void loadUserAccounts(nextPage)
}
</script>