import { describe, expect, it } from 'vitest'
import {
  authorizeDashboardDisplay,
  isDashboardWidgetEnabled,
  normalizeDashboardDisplay,
  toggleDashboardSelection,
} from '@/app/utils/dashboard-display'

describe('dashboard display selection', () => {
  it('defaults to all values without sharing mutable selection arrays', () => {
    const first = normalizeDashboardDisplay()
    const second = normalizeDashboardDisplay()
    expect(first.widgets).toHaveLength(9)
    expect(first.kpis).toHaveLength(5)
    first.kpis.length = 0
    expect(second.kpis).toHaveLength(5)
    expect(normalizeDashboardDisplay().kpis).toHaveLength(5)
  })

  it('preserves intentionally empty selections', () => {
    expect(normalizeDashboardDisplay({ widgets: [], kpis: [] })).toMatchObject({
      widgets: [],
      kpis: [],
    })
  })

  it('drops unknown and duplicate identifiers in catalog order', () => {
    expect(normalizeDashboardDisplay({
      kpis: ['noComms', 'deployed', 'deployed', 'unknown', null],
      widgets: ['criticalEquipment', 'topKpis', 'unknown'],
    })).toMatchObject({
      kpis: ['deployed', 'noComms'],
      widgets: ['topKpis', 'criticalEquipment'],
    })
  })

  it.each([null, 'invalid', [], { kpis: false }])(
    'restores defaults for malformed preferences %j',
    (value) => expect(normalizeDashboardDisplay(value).kpis).toHaveLength(5),
  )

  it('disables summary sections when none of their values are selected', () => {
    const display = normalizeDashboardDisplay({
      kpis: [],
      personnelValues: [],
      equipmentValues: [],
      operationalValues: [],
    })
    for (const key of ['topKpis', 'personnelDeploymentSummary', 'equipmentStatusOverview', 'operationalTimeMonitoring'] as const) {
      expect(isDashboardWidgetEnabled(display, key)).toBe(false)
    }
    expect(isDashboardWidgetEnabled(display, 'criticalPersonnel')).toBe(true)
  })

  it('requires both personnel and deployment privileges for personnel KPIs', () => {
    const display = normalizeDashboardDisplay()
    expect(authorizeDashboardDisplay(display, ['personnel.view']).widgets).toEqual([])
    expect(authorizeDashboardDisplay(display, ['deployment.view']).widgets).toEqual([
      'nearRotation', 'operationalTimeMonitoring',
    ])
    expect(authorizeDashboardDisplay(display, ['equipment.view']).widgets).toEqual([
      'equipmentStatusOverview', 'criticalEquipment',
    ])
    expect(authorizeDashboardDisplay(display, ['personnel.view', 'deployment.view']).widgets).toContain('topKpis')
    expect(display.widgets).toHaveLength(9)
  })

  it('does not restore deliberately hidden widgets when applying privileges', () => {
    expect(authorizeDashboardDisplay(normalizeDashboardDisplay({ widgets: [] }), [
      'personnel.view', 'deployment.view', 'equipment.view',
    ]).widgets).toEqual([])
  })

  it('toggles selections without mutating the input or duplicating keys', () => {
    const selection = ['deployed']
    expect(toggleDashboardSelection(selection, 'deployed', true)).toEqual(['deployed'])
    expect(toggleDashboardSelection(selection, 'noComms', true)).toEqual(['deployed', 'noComms'])
    expect(toggleDashboardSelection(selection, 'deployed', false)).toEqual([])
    expect(selection).toEqual(['deployed'])
  })
})
