import { createError } from 'h3'
import type { UpdateApplicationSettingsRequest } from '../../requests'

export const parseApplicationSettingsUpdates = (body: UpdateApplicationSettingsRequest) => {
  const updates: Record<string, unknown> = {}

  if (body.pageSize !== undefined) {
    const pageSize = Math.trunc(Number(body.pageSize))
    if (!Number.isFinite(pageSize) || pageSize < 1 || pageSize > 100) {
      throw createError({ statusCode: 400, statusMessage: 'Page size must be between 1 and 100.' })
    }
    updates.page_size = pageSize
  }

  if (body.appName !== undefined) updates.app_name = body.appName.trim()
  if (body.appShortCode !== undefined) updates.app_short_code = body.appShortCode.trim()
  if (body.appDescription !== undefined) updates.app_description = body.appDescription?.trim() ?? null
  if (body.defaultTimezone !== undefined) updates.default_timezone = body.defaultTimezone.trim()
  if (body.defaultLocale !== undefined) updates.default_locale = body.defaultLocale.trim()
  if (body.defaultDateFormat !== undefined) updates.default_date_format = body.defaultDateFormat.trim()
  if (body.defaultTimeFormat !== undefined) updates.default_time_format = body.defaultTimeFormat
  if (body.appTheme !== undefined) updates.app_theme = body.appTheme.trim()
  if (body.densityMode !== undefined) updates.density_mode = body.densityMode

  if (Object.keys(updates).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No updates were provided.' })
  }

  return updates
}
