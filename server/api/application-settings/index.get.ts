import { defineEventHandler } from 'h3'
import type { ApplicationSettingsResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { getCachedApplicationSettings } from '../../utils/application-settings/cache'
import { toApplicationSettingsItem } from '../../shared/utils'
import { requirePermission } from '../../utils/auth/requirePermission'

export default defineEventHandler(async (event): Promise<ApplicationSettingsResponse> => {
  await requirePermission(event, PERMISSION_CODES.userUpdate)
  const settings = await getCachedApplicationSettings()

  return {
    item: toApplicationSettingsItem(settings),
  }
})
