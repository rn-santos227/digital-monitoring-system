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
