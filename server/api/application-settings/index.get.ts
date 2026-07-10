import { defineEventHandler } from 'h3'
import type { ApplicationSettingsResponse } from '../../shared/responses'
import { getCachedApplicationSettings } from '../../utils/application-settings/cache'
import { toApplicationSettingsItem } from '../../shared/utils'

export default defineEventHandler(async (): Promise<ApplicationSettingsResponse> => {
  const settings = await getCachedApplicationSettings()

  return {
    item: toApplicationSettingsItem(settings),
  }
})
