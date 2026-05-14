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
        v-else-if="loadError"
        tone="danger"
        :message="loadError"
      />
      <BaseAlert
        v-else-if="validationError"
        tone="danger"
        :message="validationError"
      />
      <form class="grid gap-4 md:grid-cols-2" @submit.prevent="onSubmit">
        <BaseTextField v-model="form.appName" label="Application Name" :disabled="!canUpdate || isSubmitting" />
        <BaseTextField v-model="form.appShortCode" label="Short Code" :disabled="!canUpdate || isSubmitting" />
        <BaseTextField v-model="form.defaultTimezone" label="Default Timezone" :disabled="!canUpdate || isSubmitting" />
        <BaseTextField v-model="form.defaultLocale" label="Default Locale" :disabled="!canUpdate || isSubmitting" />
        <BaseTextField v-model="form.defaultDateFormat" label="Date Format" :disabled="!canUpdate || isSubmitting" />
        <BaseSelect v-model="form.defaultTimeFormat" label="Time Format" :options="timeFormatOptions" :disabled="!canUpdate || isSubmitting" />
        <BaseTextField v-model="form.appTheme" label="Theme" :disabled="!canUpdate || isSubmitting" />
        <BaseSelect v-model="form.densityMode" label="Density Mode" :options="densityOptions" :disabled="!canUpdate || isSubmitting" />
        <BaseTextField v-model="form.pageSize" label="Page Size" type="number" :disabled="!canUpdate || isSubmitting" />
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
import BaseTextField from '~/components/ui/BaseTextField.vue'
import { useApplicationSettings } from '~/composables/useApplicationSettings'
import { useUpdateSettingsHandler } from '~/handlers/settings'

const {
  canUpdate,
  densityOptions,
  form,
  isSubmitting,
  loadError,
  timeFormatOptions,
  toUpdatePayload,
  updateApplicationSettings,
} = useApplicationSettings()
const { onUpdateSettings, validationError } = useUpdateSettingsHandler({ canUpdate, updateApplicationSettings })

const onSubmit = async () => {
  await onUpdateSettings(toUpdatePayload())
}
</script>
