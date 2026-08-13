<template>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  USERS_PROFILE_AVATAR_URL_LABEL,
  USERS_PROFILE_AVATAR_URL_PLACEHOLDER,
  USERS_PROFILE_BULK_UPDATE_MODAL_DESCRIPTION,
  USERS_PROFILE_BULK_UPDATE_MODAL_TITLE,
  USERS_PROFILE_BULK_UPDATE_WARNING,
} from '~/constants/page.constants'
import type { UserProfileBulkUpdateValues } from '~/types/domain/users'
import { validateUserProfileBulkUpdate } from '~/utils/bulk-management-validation'
</script>
