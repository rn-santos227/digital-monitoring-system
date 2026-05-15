<template>
  <main :class="LOGIN_PAGE_LAYOUT_CLASSES">
    <section :class="LOGIN_PAGE_CONTAINER_CLASSES">
      <aside :class="LOGIN_PAGE_BRAND_PANEL_CLASSES">
        <div class="relative z-10 space-y-16">
          <header class="space-y-3">
            <p class="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-100">
              {{ landingBadge }}
            </p>
            <h1 class="max-w-xl text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {{ landingAppName }}
            </h1>
            <p class="max-w-xl text-lg leading-relaxed text-emerald-100/95">
              {{ landingAppDescription }}
            </p>
          </header>

          <div class="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
            <div class="flex items-center gap-3">
              <ShieldCheckIcon class="h-6 w-6 text-emerald-100" aria-hidden="true" />
              <p class="text-sm font-medium text-emerald-50">Mission-ready operations start with secure authentication.</p>
            </div>
          </div>
        </div>

        <p class="relative z-10 text-xs text-emerald-100/80">{{ LOGIN_PAGE_FOOTER_NOTICE }}</p>
        <div :class="LOGIN_PAGE_BRAND_OVERLAY_CLASSES" />
      </aside>

      <section :class="LOGIN_PAGE_FORM_PANEL_CLASSES">
        <div :class="LOGIN_PAGE_FORM_CARD_WRAPPER_CLASSES">
          <BaseCard :title="LOGIN_PAGE_CARD_TITLE" :subtitle="LOGIN_PAGE_CARD_SUBTITLE" padding="lg">
            <form class="space-y-5" @submit.prevent="submitLoginForm">
              <BaseTextField
                v-model="formState.email"
                type="email"
                :label="LOGIN_PAGE_EMAIL_LABEL"
                :placeholder="LOGIN_PAGE_EMAIL_PLACEHOLDER"
                :error="formErrors.email"
                required
                :disabled="isSubmitting"
              />

              <BaseTextField
                v-model="formState.password"
                type="password"
                :label="LOGIN_PAGE_PASSWORD_LABEL"
                :placeholder="LOGIN_PAGE_PASSWORD_PLACEHOLDER"
                :error="formErrors.password"
                required
                :disabled="isSubmitting"
              />

              <div :class="LOGIN_PAGE_FORM_META_CLASSES">
                <BaseCheckbox
                  v-model="formState.rememberSession"
                  :label="LOGIN_PAGE_REMEMBER_LABEL"
                  :disabled="isSubmitting"
                />
                <NuxtLink to="#" :class="LOGIN_PAGE_FORGOT_LINK_CLASSES">{{ LOGIN_PAGE_FORGOT_LABEL }}</NuxtLink>
              </div>

              <BaseButton
                type="submit"
                full-width
                :disabled="isSubmitDisabled"
              >
                {{ isSubmitting ? 'Signing In...' : LOGIN_PAGE_SIGN_IN_LABEL }}
              </BaseButton>

              <BaseAlert
                v-if="loginError"
                :title="LOGIN_PAGE_SIGN_IN_ERROR_TITLE"
                :message="loginError"
                tone="danger"
              />
            </form>
          </BaseCard>

          <p class="text-center text-sm text-slate-600">{{ LOGIN_PAGE_SUPPORT_TEXT }}</p>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ShieldCheckIcon } from '@heroicons/vue/24/outline'
import { storeToRefs } from 'pinia'
import { computed, onMounted } from 'vue'
import {
  LOGIN_PAGE_BADGE,
  LOGIN_PAGE_CARD_SUBTITLE,
  LOGIN_PAGE_CARD_TITLE,
  LOGIN_PAGE_EMAIL_LABEL,
  LOGIN_PAGE_EMAIL_PLACEHOLDER,
  LOGIN_PAGE_FOOTER_NOTICE,
  LOGIN_PAGE_FORGOT_LABEL,
  LOGIN_PAGE_PASSWORD_LABEL,
  LOGIN_PAGE_PASSWORD_PLACEHOLDER,
  LOGIN_PAGE_REMEMBER_LABEL,
  LOGIN_PAGE_SIGN_IN_LABEL,
  LOGIN_PAGE_SIGN_IN_ERROR_TITLE,
  LOGIN_PAGE_SUBTITLE,
  LOGIN_PAGE_SUPPORT_TEXT,
  LOGIN_PAGE_TITLE,
} from '~/constants/page.constants'
import {
  LOGIN_PAGE_BRAND_OVERLAY_CLASSES,
  LOGIN_PAGE_BRAND_PANEL_CLASSES,
  LOGIN_PAGE_CONTAINER_CLASSES,
  LOGIN_PAGE_FORGOT_LINK_CLASSES,
  LOGIN_PAGE_FORM_CARD_WRAPPER_CLASSES,
  LOGIN_PAGE_FORM_META_CLASSES,
  LOGIN_PAGE_FORM_PANEL_CLASSES,
  LOGIN_PAGE_LAYOUT_CLASSES,
} from '~/constants/shared.constants'
import { useLoginForm } from '~/composables/useLogin'
import { useLoginPageHandlers } from '~/handlers'
import { useApplicationSettingsStore } from '~/stores/application-settings'

const {
  formState,
  formErrors,
  isSubmitting,
  loginError,
  isSubmitDisabled,
  validateForm,
} = useLoginForm()

const { submitLoginForm } = useLoginPageHandlers(formState, loginError, validateForm)


const applicationSettingsStore = useApplicationSettingsStore()
const { hasLoaded, item: settingsItem } = storeToRefs(applicationSettingsStore)

const normalizeSettingLabel = (value: string | null | undefined) => value?.trim() ?? ''

const landingAppName = computed(() => {
  const appName = normalizeSettingLabel(settingsItem.value?.appName)

  if (appName) {
    return appName
  }

  return hasLoaded.value ? LOGIN_PAGE_TITLE : ''
})

const landingAppDescription = computed(() => {
  const appDescription = normalizeSettingLabel(settingsItem.value?.appDescription)

  if (appDescription) {
    return appDescription
  }

  return hasLoaded.value ? LOGIN_PAGE_SUBTITLE : ''
})

const landingBadge = computed(() => {
  const appShortCode = normalizeSettingLabel(settingsItem.value?.appShortCode)

  if (appShortCode) {
    return appShortCode
  }

  return hasLoaded.value ? LOGIN_PAGE_BADGE : ''
})

onMounted(async () => {
  if (applicationSettingsStore.hasLoaded) {
    return
  }

  try {
    await applicationSettingsStore.initialize()
  } catch {
    // Keep default landing copy when settings are unavailable.
  }
})
</script>
