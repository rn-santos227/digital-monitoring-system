import { computed, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { SETTINGS_PRIVILEGES } from '~/constants/privileges.constants'
import { useApplicationSettingsStore } from '~/stores/application-settings'
import { useAuthStore } from '~/stores/auth'
import {
  APP_THEME_VALUES,
  DATE_FORMAT_VALUES,
  DENSITY_OPTIONS,
  PAGE_SIZE_VALUES,
  TIMEZONE_VALUES,
  TIME_FORMAT_OPTIONS,
} from '~/types/enums'
import type { UpdateApplicationSettingsPayload } from '~/types/domain/application-settings'
import { normalizeDateFormat } from '~/utils/date-format'

export const useApplicationSettings = () => {
  const authStore = useAuthStore()
  const applicationSettingsStore = useApplicationSettingsStore()
  const { isSubmitting, loadError } = storeToRefs(applicationSettingsStore)

  const canUpdate = computed(() => authStore.hasPermissionAccess(SETTINGS_PRIVILEGES.update))

  const timeFormatOptions = TIME_FORMAT_OPTIONS
  const densityOptions = DENSITY_OPTIONS
  const themeOptions = Object.freeze(APP_THEME_VALUES.map((value) => ({ value, label: value[0]?.toUpperCase() + value.slice(1) })))
  const timezoneOptions = Object.freeze(TIMEZONE_VALUES.map((value) => ({ value, label: value })))
  const pageSizeOptions = Object.freeze(PAGE_SIZE_VALUES.map((value) => ({ value: String(value), label: String(value) })))
  const dateFormatOptions = Object.freeze(DATE_FORMAT_VALUES.map((value) => ({ value, label: value })))

  const form = reactive({
    appName: '',
    appShortCode: '',
    appDescription: '',
    defaultTimezone: 'UTC',
    defaultLocale: 'en-US',
    defaultDateFormat: 'yyyy-MM-dd',
    defaultTimeFormat: '24h',
    appTheme: 'light',
    densityMode: 'comfortable',
    pageSize: '20',
    mapDefaultLatitude: '12.879721',
    mapDefaultLongitude: '121.774017',
    mapDefaultZoom: '6',
  })

  watch(
    () => applicationSettingsStore.item,
    (item) => {
      if (!item) {
        return
      }

      form.appName = item.appName
      form.appShortCode = item.appShortCode
      form.appDescription = item.appDescription ?? ''
      form.defaultTimezone = item.defaultTimezone
      form.defaultLocale = item.defaultLocale
      form.defaultDateFormat = normalizeDateFormat(item.defaultDateFormat)
      form.defaultTimeFormat = item.defaultTimeFormat
      form.appTheme = item.appTheme
      form.densityMode = item.densityMode
      form.pageSize = String(item.pageSize)
      form.mapDefaultLatitude = String(item.mapDefaultLatitude)
      form.mapDefaultLongitude = String(item.mapDefaultLongitude)
      form.mapDefaultZoom = String(item.mapDefaultZoom)
    },
    { immediate: true },
  )

  const toUpdatePayload = (): UpdateApplicationSettingsPayload => ({
    appName: form.appName.trim(),
    appShortCode: form.appShortCode.trim(),
    appDescription: form.appDescription.trim() || null,
    defaultTimezone: form.defaultTimezone.trim(),
    defaultLocale: form.defaultLocale.trim(),
    defaultDateFormat: form.defaultDateFormat.trim(),
    defaultTimeFormat: form.defaultTimeFormat as '12h' | '24h',
    appTheme: form.appTheme.trim(),
    densityMode: form.densityMode as 'compact' | 'comfortable' | 'spacious',
    pageSize: Number(form.pageSize),
    mapDefaultLatitude: Number(form.mapDefaultLatitude),
    mapDefaultLongitude: Number(form.mapDefaultLongitude),
    mapDefaultZoom: Number(form.mapDefaultZoom),
  })

  const updateApplicationSettings = async (payload: UpdateApplicationSettingsPayload) => {
    await applicationSettingsStore.update(payload)
  }

  return {
    canUpdate,
    densityOptions,
    dateFormatOptions,
    form,
    isSubmitting,
    loadError,
    pageSizeOptions,
    themeOptions,
    timeFormatOptions,
    timezoneOptions,
    toUpdatePayload,
    updateApplicationSettings,
  }
}
