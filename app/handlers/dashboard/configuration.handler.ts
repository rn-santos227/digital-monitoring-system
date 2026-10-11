import { computed, ref } from 'vue'
import type {
  DashboardConfiguration,
  DashboardLoadResult,
} from '~/types/domain/dashboard'
import { DASHBOARD_DISPLAY_STORAGE_WARNING } from '~/constants/page.constants'
import {
  authorizeDashboardDisplay,
  normalizeDashboardDisplay,
} from '~/utils/dashboard-display'
import {
  readDashboardDisplay,
  saveDashboardDisplay,
} from '~/utils/dashboard-display-storage'
import {
  normalizeDashboardParameters,
  readDashboardParameters,
  saveDashboardParameters,
} from '~/utils/dashboard-parameters-storage'
import { createInitialDashboardData, loadDashboardData } from './load.handler'

export const createDashboardConfigurationHandlers = (
  getUserId: () => string,
  getPermissions: () => readonly string[],
) => {
  const parameters = ref(normalizeDashboardParameters())
  const display = ref(normalizeDashboardDisplay())
  const dashboardData = ref(createInitialDashboardData())
  const errors = ref<DashboardLoadResult['errors']>({})
  const isLoading = ref(false)
  const storageWarning = ref('')
  const effectiveDisplay = computed(() =>
    authorizeDashboardDisplay(display.value, getPermissions()),
  )
  let requestVersion = 0

  const loadConfiguration = async (value: DashboardConfiguration) => {
    const version = ++requestVersion
    const userId = getUserId()
    parameters.value = normalizeDashboardParameters(value.parameters)
    display.value = normalizeDashboardDisplay(value.display)
    errors.value = {}
    isLoading.value = true
    const result = await loadDashboardData(
      parameters.value,
      display.value,
      getPermissions(),
    )
    if (version !== requestVersion || userId !== getUserId()) return
    dashboardData.value = result.data
    errors.value = result.errors
    isLoading.value = false
  }

  const applyConfiguration = async (value: DashboardConfiguration) => {
    let persisted = saveDashboardDisplay(value.display, getUserId())
    try {
      saveDashboardParameters(value.parameters)
    } catch {
      persisted = false
    }
    storageWarning.value = persisted ? '' : DASHBOARD_DISPLAY_STORAGE_WARNING
    await loadConfiguration(value)
  }

  const initializeConfiguration = async () => {
    storageWarning.value = ''
    await loadConfiguration({
      parameters: readDashboardParameters(),
      display: readDashboardDisplay(getUserId()),
    })
  }
  return {
    parameters,
    display,
    effectiveDisplay,
    dashboardData,
    errors,
    isLoading,
    storageWarning,
    applyConfiguration,
    initializeConfiguration,
  }
}
