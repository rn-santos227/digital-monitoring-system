import { defineEventHandler } from 'h3'
import type { ApplicationSettingsResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getCachedApplicationSettings } from '../../utils/application-settings/cache'

export default defineEventHandler(async (event): Promise<ApplicationSettingsResponse> => {
  await requirePermission(event, PERMISSION_CODES.userUpdate)

  const settings = await getCachedApplicationSettings()

  return {
    item: {
      id: settings.id,
      appName: settings.app_name,
      appShortCode: settings.app_short_code,
      appDescription: settings.app_description,
      defaultTimezone: settings.default_timezone,
      defaultLocale: settings.default_locale,
      defaultDateFormat: settings.default_date_format,
      defaultTimeFormat: settings.default_time_format,
      appTheme: settings.app_theme,
      densityMode: settings.density_mode,
      pageSize: settings.page_size,
      updatedAt: settings.updated_at,
    },
  }
})
