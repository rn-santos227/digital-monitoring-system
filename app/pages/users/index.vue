<template>
  <main class="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    <section :class="USERS_PAGE_SECTION_CLASSES">
      <header :class="USERS_PAGE_HEADER_CLASSES">
        <h1 class="text-3xl font-semibold text-slate-900">{{ USERS_PAGE_TITLE }}</h1>
        <p class="text-sm text-slate-600">{{ USERS_PAGE_SUBTITLE }}</p>
      </header>

      <BaseTab
        :model-value="activeTab"
        :items="USERS_PAGE_TAB_ITEMS"
        :aria-label="USERS_PAGE_TABS_ARIA_LABEL"
        @update:model-value="onTabChange"
      />

      <BaseAlert
        v-if="error"
        :message="error"
        tone="danger"
      />
      
      <template v-if="activeTab === 'user-profile'">
        <div :class="USERS_TABLE_ACTIONS_ROW_CLASSES">
          <BaseButton>
            {{ USERS_PROFILE_CREATE_BUTTON_LABEL }}
          </BaseButton>
        </div>

        <DataTable
          :title="USERS_PROFILE_TABLE_TITLE"
          :columns="USERS_PROFILE_TABLE_COLUMNS"
          :rows="profileTableRows"
          row-key="id"
          :actions="USERS_PROFILE_TABLE_ACTIONS"
          :action-button-count="USERS_PROFILE_TABLE_ACTIONS.length"
          :actions-column-label="USERS_PROFILE_TABLE_ACTIONS_COLUMN_LABEL"
          :is-loading="isLoading"
          :search-query="profileSearchQuery"
          :search-placeholder="USERS_PROFILE_TABLE_SEARCH_PLACEHOLDER"
          :empty-message="USERS_PROFILE_TABLE_EMPTY_MESSAGE"
          :current-page="profilePagination.page"
          :total-pages="profilePagination.totalPages"
          @update:search-query="onProfileSearch"
          @update:current-page="onProfilePageChange"
        />
      </template>

      <template v-else>
        <div :class="USERS_TABLE_ACTIONS_ROW_CLASSES">
          <BaseButton>
            {{ USERS_ACCOUNT_CREATE_BUTTON_LABEL }}
          </BaseButton>
        </div>

        <DataTable
          :title="USERS_ACCOUNT_TABLE_TITLE"
          :columns="USERS_ACCOUNT_TABLE_COLUMNS"
          :rows="accountTableRows"
          row-key="id"
          :actions="USERS_ACCOUNT_TABLE_ACTIONS"
          :action-button-count="USERS_ACCOUNT_TABLE_ACTIONS.length"
          :actions-column-label="USERS_ACCOUNT_TABLE_ACTIONS_COLUMN_LABEL"
          :is-loading="isLoading"
          :search-query="accountSearchQuery"
          :search-placeholder="USERS_ACCOUNT_TABLE_SEARCH_PLACEHOLDER"
          :empty-message="USERS_ACCOUNT_TABLE_EMPTY_MESSAGE"
          :current-page="accountPagination.page"
          :total-pages="accountPagination.totalPages"
          @update:search-query="onAccountSearch"
          @update:current-page="onAccountPageChange"
        />
      </template>
    </section>
  </main>
</template>

<script setup lang="ts">
import {
  USERS_ACCOUNT_TABLE_ACTIONS,
  USERS_ACCOUNT_TABLE_ACTIONS_COLUMN_LABEL,
  USERS_ACCOUNT_TABLE_COLUMNS,
  USERS_ACCOUNT_CREATE_BUTTON_LABEL,
  USERS_ACCOUNT_TABLE_EMPTY_MESSAGE,
  USERS_ACCOUNT_TABLE_SEARCH_PLACEHOLDER,
  USERS_ACCOUNT_TABLE_TITLE,
  USERS_PAGE_SECTION_CLASSES,
  USERS_PAGE_SUBTITLE,
  USERS_PAGE_TAB_ITEMS,
  USERS_PAGE_TABS_ARIA_LABEL,
  USERS_PAGE_TITLE,
  USERS_PROFILE_TABLE_ACTIONS,
  USERS_PROFILE_TABLE_ACTIONS_COLUMN_LABEL,
  USERS_PROFILE_TABLE_COLUMNS,
  USERS_PROFILE_CREATE_BUTTON_LABEL,
  USERS_PROFILE_TABLE_EMPTY_MESSAGE,
  USERS_PROFILE_TABLE_SEARCH_PLACEHOLDER,
  USERS_PROFILE_TABLE_TITLE,
} from '~/constants/page.constants'
import { USERS_PAGE_HEADER_CLASSES, USERS_TABLE_ACTIONS_ROW_CLASSES } from '~/constants/shared.constants'
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
