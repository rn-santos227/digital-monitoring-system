import { DASHBOARD_DISPLAY_STORAGE_KEY } from '~/constants/page.constants'
import type { DashboardDisplaySettings } from '~/types/domain/dashboard'
import { normalizeDashboardDisplay } from '~/utils/dashboard-display'

export const readDashboardDisplay = (userId: string): DashboardDisplaySettings => {
  if (import.meta.server || !userId) return normalizeDashboardDisplay()
  try {
    const stored = localStorage.getItem(`${DASHBOARD_DISPLAY_STORAGE_KEY}:${userId}`)
    return normalizeDashboardDisplay(stored ? JSON.parse(stored) : undefined)
  } catch {
    return normalizeDashboardDisplay()
  }
}

export const saveDashboardDisplay = (
  settings: DashboardDisplaySettings,
  userId: string,
): boolean => {
  if (import.meta.server || !userId) return false
  try {
    localStorage.setItem(
      `${DASHBOARD_DISPLAY_STORAGE_KEY}:${userId}`,
      JSON.stringify(normalizeDashboardDisplay(settings)),
    )
    return true
  } catch {
    return false
  }
}
