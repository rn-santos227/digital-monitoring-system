<template>
  <section class="space-y-6">
    <BaseCard
      title="Application Settings"
      subtitle="Configure monitoring defaults that are stored locally after first load for faster access."
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
          <BaseSelect v-model="form.defaultTimeFormat" label="Time Format" :options="timeFormatOptions" :disabled="!canUpdate || isSubmitting" />
          <BaseSelect v-model="form.appTheme" label="Theme" :options="themeOptions" :disabled="!canUpdate || isSubmitting" />
          <BaseSelect v-model="form.densityMode" label="Density Mode" :options="densityOptions" :disabled="!canUpdate || isSubmitting" />
          <BaseSelect v-model="form.pageSize" label="Page Size" :options="pageSizeOptions" :disabled="!canUpdate || isSubmitting" />
        </div>
      </form>
      <template #actions>
        <BaseButton :disabled="!canUpdate || isSubmitting" @click="onSubmit">
          Save Settings
        </BaseButton>
      </template>
    </BaseCard>
  </section>
</template>

<script setup lang="ts">
import BaseAlert from '~/components/ui/BaseAlert.vue'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import BaseSelect from '~/components/ui/BaseSelect.vue'
import BaseTextArea from '~/components/ui/BaseTextArea.vue'
import BaseTextField from '~/components/ui/BaseTextField.vue'
import { useApplicationSettings } from '~/composables/useApplicationSettings'
import { useUpdateSettingsHandler } from '~/handlers/settings'

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
const { dangerMessage, errorMessage, infoMessage, onUpdateSettings, validationError } = useUpdateSettingsHandler({
  canUpdate,
  updateApplicationSettings,
})

const onSubmit = async () => {
  await onUpdateSettings(toUpdatePayload())
}
</script>
