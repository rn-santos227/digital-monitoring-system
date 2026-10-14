// @vitest-environment happy-dom

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createDashboardConfigurationHandlers } from '@/app/handlers/dashboard/configuration.handler'
import { createInitialDashboardData, loadDashboardData } from '@/app/handlers/dashboard/load.handler'
import { normalizeDashboardDisplay } from '@/app/utils/dashboard-display'
import { normalizeDashboardParameters } from '@/app/utils/dashboard-parameters-storage'
import { saveDashboardDisplay } from '@/app/utils/dashboard-display-storage'
import type { DashboardTopKpis } from '@/app/types/domain/dashboard'

const endpoints = vi.hoisted(() => ({
  topKpis: vi.fn(),
  personnelDeploymentSummary: vi.fn(),
  equipmentStatusOverview: vi.fn(),
  criticalPersonnel: vi.fn(),
  criticalEquipment: vi.fn(),
  nearRotation: vi.fn(),
  locationLoadAnalysis: vi.fn(),
  personnelDeploymentHistory: vi.fn(),
  operationalTimeMonitoring: vi.fn(),
}))

vi.mock('@/app/utils/dashboard-endpoints', () => ({
  getDashboardTopKpisEndpoint: endpoints.topKpis,
  getDashboardPersonnelDeploymentSummaryEndpoint: endpoints.personnelDeploymentSummary,
  getDashboardEquipmentStatusOverviewEndpoint: endpoints.equipmentStatusOverview,
  getDashboardCriticalPersonnelEndpoint: endpoints.criticalPersonnel,
  getDashboardCriticalEquipmentEndpoint: endpoints.criticalEquipment,
  getDashboardNearRotationEndpoint: endpoints.nearRotation,
  getDashboardLocationLoadAnalysisEndpoint: endpoints.locationLoadAnalysis,
  getDashboardPersonnelDeploymentHistoryEndpoint: endpoints.personnelDeploymentHistory,
  getDashboardOperationalTimeMonitoringEndpoint: endpoints.operationalTimeMonitoring,
}))

const permissions = ['personnel.view', 'deployment.view', 'equipment.view']
const parameters = normalizeDashboardParameters()
const topOnly = normalizeDashboardDisplay({ widgets: ['topKpis'], kpis: ['deployed'] })

describe('dashboard selective loading and customization', () => {
  beforeEach(() => {
    vi.stubGlobal('__TEST_NUXT_CLIENT__', true)
    localStorage.clear()
    const data = createInitialDashboardData()
    for (const key of Object.keys(endpoints) as (keyof typeof endpoints)[]) {
      endpoints[key].mockReset().mockResolvedValue(data[key])
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('fetches only selected sections and sends only analysis parameters', async () => {
    await loadDashboardData(parameters, topOnly, permissions)
    expect(endpoints.topKpis).toHaveBeenCalledExactlyOnceWith(parameters)
    for (const key of Object.keys(endpoints) as (keyof typeof endpoints)[]) {
      if (key !== 'topKpis') expect(endpoints[key]).not.toHaveBeenCalled()
    }
  })

  it('does not fetch hidden values or sections without all required privileges', async () => {
    await loadDashboardData(parameters, normalizeDashboardDisplay({ kpis: [], widgets: ['topKpis'] }), permissions)
    await loadDashboardData(parameters, topOnly, ['personnel.view'])
    await loadDashboardData(parameters, normalizeDashboardDisplay({ widgets: [] }), permissions)
    expect(Object.values(endpoints).every((endpoint) => endpoint.mock.calls.length === 0)).toBe(true)
  })

  it('loads permitted sections without requesting inaccessible personnel data', async () => {
    await loadDashboardData(parameters, normalizeDashboardDisplay(), ['equipment.view'])
    expect(endpoints.equipmentStatusOverview).toHaveBeenCalledOnce()
    expect(endpoints.criticalEquipment).toHaveBeenCalledOnce()
    expect(endpoints.topKpis).not.toHaveBeenCalled()
    expect(endpoints.nearRotation).not.toHaveBeenCalled()
  })

  it('retains successful values when a separate widget request fails', async () => {
    endpoints.topKpis.mockResolvedValue({ ...createInitialDashboardData().topKpis, deployed: 42 })
    endpoints.criticalEquipment.mockRejectedValue(Object.assign(new Error('Equipment unavailable'), {
      statusMessage: 'Equipment unavailable',
    }))
    const result = await loadDashboardData(parameters, normalizeDashboardDisplay({
      widgets: ['topKpis', 'criticalEquipment'],
    }), permissions)
    expect(result.data.topKpis.deployed).toBe(42)
    expect(result.errors).toEqual({ criticalEquipment: 'Equipment unavailable' })
  })

  it('initializes the dashboard using saved account choices', async () => {
    saveDashboardDisplay(topOnly, 'official-1')
    const handlers = createDashboardConfigurationHandlers(() => 'official-1', () => permissions)
    await handlers.initializeConfiguration()
    expect(handlers.display.value).toEqual(topOnly)
    expect(endpoints.topKpis).toHaveBeenCalledOnce()
    expect(endpoints.criticalEquipment).not.toHaveBeenCalled()
    expect(handlers.isLoading.value).toBe(false)
  })

  it('applies choices for the current visit when persistence fails', async () => {
    vi.stubGlobal('localStorage', {
      setItem: () => { throw new Error('Storage blocked') },
    })
    const handlers = createDashboardConfigurationHandlers(() => 'official-1', () => permissions)
    await handlers.applyConfiguration({ parameters, display: topOnly })
    expect(handlers.display.value).toEqual(topOnly)
    expect(handlers.storageWarning.value).toContain('may not be saved')
    expect(endpoints.topKpis).toHaveBeenCalledOnce()
    expect(handlers.isLoading.value).toBe(false)
  })

  it('ignores an older response after a newer configuration has loaded', async () => {
    let finishOld: (value: DashboardTopKpis) => void = () => {}
    endpoints.topKpis.mockReturnValueOnce(new Promise<DashboardTopKpis>((resolve) => { finishOld = resolve }))
    endpoints.topKpis.mockResolvedValueOnce({ ...createInitialDashboardData().topKpis, deployed: 22 })
    const handlers = createDashboardConfigurationHandlers(() => 'official-1', () => permissions)
    const oldLoad = handlers.applyConfiguration({ parameters, display: topOnly })
    await handlers.applyConfiguration({ parameters: { ...parameters, itemLimit: 5 }, display: topOnly })
    finishOld({ ...createInitialDashboardData().topKpis, deployed: 11 })
    await oldLoad
    expect(handlers.dashboardData.value.topKpis.deployed).toBe(22)
    expect(handlers.parameters.value.itemLimit).toBe(5)
    expect(handlers.isLoading.value).toBe(false)
  })

  it('loads the next account preferences and rejects previous account results', async () => {
    let userId = 'official-1'
    let finishOld: (value: DashboardTopKpis) => void = () => {}
    endpoints.topKpis.mockReturnValueOnce(new Promise<DashboardTopKpis>((resolve) => { finishOld = resolve }))
    saveDashboardDisplay(normalizeDashboardDisplay({ widgets: [] }), 'official-2')
    const handlers = createDashboardConfigurationHandlers(() => userId, () => permissions)
    const oldLoad = handlers.applyConfiguration({ parameters, display: topOnly })
    userId = 'official-2'
    await handlers.initializeConfiguration()
    finishOld({ ...createInitialDashboardData().topKpis, deployed: 11 })
    await oldLoad
    expect(handlers.display.value.widgets).toEqual([])
    expect(handlers.dashboardData.value.topKpis.deployed).toBe(0)
    expect(handlers.isLoading.value).toBe(false)
  })
})
