import type { ApplicationSettingsRow } from '../../shared/models'
import { getServiceSupabaseClient } from '../auth/serviceClient'

const APPLICATION_SETTINGS_KEY = 'default'
let applicationSettingsCache: ApplicationSettingsRow | null = null
let applicationSettingsCacheUpdatedAt: string | null = null


