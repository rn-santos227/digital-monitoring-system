import { defineEventHandler } from 'h3'
import type { ApplicationSettingsResponse } from '../../shared/responses'
import { PERMISSION_CODES } from '../../shared/constants'
import { requirePermission } from '../../utils/auth/requirePermission'
import { getCachedApplicationSettings } from '../../utils/application-settings/cache'


