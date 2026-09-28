<template>
  <main :class="APP_MAIN_CONTENT_CLASSES">
    <section class="space-y-6">
      <BaseCard
        title="Application Settings"
        subtitle="Configure monitoring defaults that are stored locally after first load for faster access."
        v-if="canUpdate"
      >
        <BaseAlert
          v-if="!canUpdate"
          tone="warning"
          message="You do not have permission to update settings."
        />
        <BaseAlert
          v-if="infoMessage"
          tone="info"
          title="Info"
          :message="infoMessage"
        />
        <BaseAlert
          v-if="errorMessage"
          tone="danger"
          title="Error"
          :message="errorMessage"
        />
        <BaseAlert
          v-if="dangerMessage"
          tone="danger"
          title="Danger"
          :message="dangerMessage"
        />
        <BaseAlert
          v-if="loadError"
          tone="danger"
          :message="loadError"
        />
        <BaseAlert
          v-if="validationError"
          tone="danger"
          :message="validationError"
        />
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div class="grid gap-4 md:grid-cols-3">
            <BaseTextField v-model="form.appName" label="Application Name" :disabled="!canUpdate || isSubmitting" />
            <BaseTextField v-model="form.appShortCode" label="Short Code" :disabled="!canUpdate || isSubmitting" />
            <BaseSelect v-model="form.defaultTimezone" label="Default Timezone" :options="timezoneOptions" :disabled="!canUpdate || isSubmitting" />
          </div>
          <BaseTextArea v-model="form.appDescription" label="Application Description" :disabled="!canUpdate || isSubmitting" />
          <div class="grid gap-4 md:grid-cols-2">
            <BaseTextField v-model="form.defaultLocale" label="Default Locale" :disabled="!canUpdate || isSubmitting" />
            <BaseSelect v-model="form.defaultDateFormat" label="Date Format" :options="dateFormatOptions" :disabled="!canUpdate || isSubmitting" />
          </div>
        </form>
      </BaseCard>
    </section>
  </main>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/ui/BaseAlert.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseTextArea from '~/components/ui/BaseTextArea.vue'
import BaseTextField from '~/components/ui/BaseTextField.vue'
import { useApplicationSettings } from '~/composables/useApplicationSettings'
import {
  BACKUP_CARD_SUBTITLE,
  BACKUP_CARD_TITLE,
  BACKUP_DOWNLOAD_LABEL,
  BACKUP_PERMISSION_WARNING,
} from '~/constants/page.constants'
import { useDownloadBackupHandler, useUpdateSettingsHandler } from '~/handlers/settings'
import { APP_MAIN_CONTENT_CLASSES } from '~/constants/shared.constants'

const {
  canUpdate,
  dateFormatOptions,
  densityOptions,
  form,
  isSubmitting,
  loadError,
  pageSizeOptions,
  themeOptions,
  timeFormatOptions,
  timezoneOptions,
  toUpdatePayload,
  updateApplicationSettings,
} = useApplicationSettings()
const { dangerMessage, errorMessage, infoMessage, onSubmit, validationError } = useUpdateSettingsHandler({
  canUpdate,
  toUpdatePayload,
  updateApplicationSettings,
})
const {
  canDownload,
  errorMessage: backupErrorMessage,
  isDownloading,
  onDownloadBackup,
} = useDownloadBackupHandler()
</script>
