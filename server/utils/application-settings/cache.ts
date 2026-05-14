import type { ApplicationSettingsRow } from '../../shared/models'
import { getServiceSupabaseClient } from '../auth/serviceClient'

const APPLICATION_SETTINGS_KEY = 'default'
let applicationSettingsCache: ApplicationSettingsRow | null = null
let applicationSettingsCacheUpdatedAt: string | null = null

const fetchApplicationSettings = async () => {
  const supabase = getServiceSupabaseClient()
  const { data, error } = await supabase
    .from('application_settings')
    .select('*')
    .eq('singleton_key', APPLICATION_SETTINGS_KEY)
    .single<ApplicationSettingsRow>()

  if (error || !data) {
    throw new Error(`Failed to fetch application settings: ${error?.message ?? 'Unknown error'}`)
  }

  return data
}

export const getCachedApplicationSettings = async () => {
  if (!applicationSettingsCache || !applicationSettingsCacheUpdatedAt) {
    const latest = await fetchApplicationSettings()
    applicationSettingsCache = latest
    applicationSettingsCacheUpdatedAt = latest.updated_at
  }

  return applicationSettingsCache
}

