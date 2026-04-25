<template>
  <BaseModal
    :title="USERS_PROFILE_VIEW_MODAL_TITLE"
    :description="USERS_PROFILE_VIEW_MODAL_DESCRIPTION"
    size="lg"
    scroll-body
    @close="emit('close')"
  >
    <div class="space-y-4">
      <dl class="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ USERS_PROFILE_FULL_NAME_LABEL }}</dt>
          <dd class="text-sm text-slate-900">{{ profile.fullName }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">{{ USERS_PROFILE_EMAIL_LABEL }}</dt>
          <dd class="text-sm text-slate-900">{{ profile.email }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</dt>
          <dd class="text-sm text-slate-900">{{ profile.isActive ? 'Active' : 'Inactive' }}</dd>
        </div>
        <div>
          <dt class="text-xs font-semibold uppercase tracking-wide text-slate-500">Personnel ID</dt>
          <dd class="text-sm text-slate-900">{{ profile.personnelId || '—' }}</dd>
        </div>
      </dl>

      <div>
        <h3 class="text-sm font-semibold text-slate-700">{{ USERS_PROFILE_ACCOUNT_TYPES_LABEL }}</h3>
        <div v-if="profile.accountTypes.length" class="mt-2 flex flex-wrap gap-2">
          <BaseChip
            v-for="accountType in profile.accountTypes"
            :key="accountType.id"
            :label="`${accountType.name} (${accountType.code})`"
            tone="info"
          />
        </div>
        <p v-else class="mt-2 text-sm text-slate-500">{{ USERS_PROFILE_VIEW_EMPTY_ACCOUNT_TYPES }}</p>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <BaseButton variant="ghost" @click="emit('close')">{{ USERS_MODAL_CLOSE_LABEL }}</BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import {
  USERS_MODAL_CLOSE_LABEL,
  USERS_PROFILE_ACCOUNT_TYPES_LABEL,
  USERS_PROFILE_EMAIL_LABEL,
  USERS_PROFILE_FULL_NAME_LABEL,
  USERS_PROFILE_VIEW_EMPTY_ACCOUNT_TYPES,
  USERS_PROFILE_VIEW_MODAL_DESCRIPTION,
  USERS_PROFILE_VIEW_MODAL_TITLE,
} from '~/constants/page.constants'
import type { UserProfileViewRecord } from '~/types/domain/users'

defineProps<{
  profile: UserProfileViewRecord
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()
</script>
