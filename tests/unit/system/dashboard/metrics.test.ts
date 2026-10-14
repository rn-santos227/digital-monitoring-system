import { describe, expect, it } from 'vitest'

import {
  buildEquipmentMetrics,
  buildPersonnelSummaryMetrics,
  calculateLocationLoadLevel,
  isDeadStatus,
  isDefectiveEquipment,
  isDeployedStatus,
  isInjuredStatus,
  isNoCommsStatus,
  isOperationalEquipment,
  isStandbyReadyEquipment,
  isStandbyStatus,
  isUnavailableStatus,
  isUnderMaintenanceEquipment,
  normalizeDashboardPersonnelStatusRows,
  normalizeStatusName,
  toFullName,
  type DashboardEquipmentStatusRow,
  type DashboardPersonnelStatusRow,
} from '@/server/shared/utils/dashboard'

const personnel = (
  id: string,
  status: string | null,
  company: string | null = 'Alpha',
): DashboardPersonnelStatusRow => ({
  id,
  first_name: ' Test ',
  last_name: id,
  company_name: company,
  service_status: status,
})

const equipment = (
  id: string,
  overrides: Partial<DashboardEquipmentStatusRow> = {},
): DashboardEquipmentStatusRow => ({
  id,
  asset_tag: `TAG-${id}`,
  condition_statuses: null,
  serviceability_statuses: null,
  asset_statuses: null,
  equipment_items: null,
  ...overrides,
})

describe('dashboard status classification', () => {
  it.each([
    [0, 0, 'light'],
    [-1, 1, 'light'],
    [100, 34, 'light'],
    [100, 35, 'moderate'],
    [100, 69, 'moderate'],
    [100, 70, 'heavy'],
  ] as const)('classifies a load of %s/%s as %s', (total, deployed, level) => {
    expect(calculateLocationLoadLevel(total, deployed)).toBe(level)
  })

  it.each([
    [isInjuredStatus, ['injured', 'wounded']],
    [isDeadStatus, ['dead', 'killed', 'KIA']],
    [isStandbyStatus, ['standby', 'reserve', 'planned']],
    [isDeployedStatus, ['deployed', 'mission', 'operation']],
    [isUnavailableStatus, ['leave', 'detached', 'retired']],
    [isNoCommsStatus, ['MIA', 'no comms', 'no-comms', 'missing in action']],
    [isDefectiveEquipment, ['damaged', 'unserviceable', 'condemned', 'lost']],
    [isUnderMaintenanceEquipment, ['repair', 'maintenance']],
  ] as const)('recognizes status synonyms with %s', (classify, synonyms) => {
    for (const synonym of synonyms) {
      expect(classify(` ${synonym.toUpperCase()} `)).toBe(true)
    }
    expect(classify('unknown')).toBe(false)
  })

  it('normalizes absent status and personnel names', () => {
    expect(normalizeStatusName(null)).toBe('')
    expect(normalizeStatusName(undefined)).toBe('')
    expect(toFullName(null, undefined)).toBe('Unknown Personnel')
    expect(toFullName(' Jane ', ' Doe ')).toBe('Jane Doe')
    expect(isOperationalEquipment('Serviceable')).toBe(true)
    expect(isOperationalEquipment('Limited serviceable')).toBe(false)
    expect(isStandbyReadyEquipment('Limited serviceable')).toBe(true)
    expect(isStandbyReadyEquipment('unknown')).toBe(false)
  })

  it('prefers the explicit service status over the legacy status name', () => {
    expect(
      normalizeDashboardPersonnelStatusRows([
        { ...personnel('1', 'Deployed'), service_status_name: 'Standby' },
        { ...personnel('2', null), service_status_name: 'Standby' },
        personnel('3', null),
      ]).map((row) => row.service_status),
    ).toEqual(['Deployed', 'Standby', null])
  })
})

describe('dashboard personnel totals', () => {
  it('counts overlapping status flags and uses active assignments for deployment totals', () => {
    const metrics = buildPersonnelSummaryMetrics(
      [
        personnel('1', 'Standby'),
        personnel('2', 'Deployed', 'Bravo'),
        personnel('3', 'Leave', 'Bravo'),
        personnel('4', 'Injured', null),
        personnel('5', 'Dead', null),
        personnel('6', 'MIA', ' '),
      ],
      new Map([['1', 'Forward base']]),
    )

    expect(metrics).toMatchObject({
      totalRegistered: 6,
      deployed: 2,
      standbyAlert: 1,
      noComms: 1,
      injuredOrDead: 2,
      personnelDeploymentSummary: {
        deployed: 2,
        unavailable: 1,
        standbyAlert: 1,
        injured: 1,
        dead: 1,
      },
    })
    expect(metrics.locationLoadAnalysis).toEqual([
      {
        locationName: 'Alpha',
        totalPersonnel: 1,
        deployedPersonnel: 1,
        loadLevel: 'heavy',
      },
      {
        locationName: 'Bravo',
        totalPersonnel: 2,
        deployedPersonnel: 1,
        loadLevel: 'moderate',
      },
      {
        locationName: 'Unassigned Company',
        totalPersonnel: 3,
        deployedPersonnel: 0,
        loadLevel: 'light',
      },
    ])
    expect(metrics.criticalPersonnel.map((item) => item.issueCode)).toEqual([
      'INJURED',
      'DEAD',
      'NO COMMS',
    ])
  })

  it('returns empty summaries and caps critical items without truncating totals', () => {
    expect(buildPersonnelSummaryMetrics([], new Map())).toMatchObject({
      totalRegistered: 0,
      criticalPersonnel: [],
    })
    const metrics = buildPersonnelSummaryMetrics(
      Array.from({ length: 8 }, (_, index) =>
        personnel(String(index), 'Injured dead no comms'),
      ),
      new Map([['0', 'Forward base']]),
    )

    expect(metrics.criticalPersonnel).toHaveLength(5)
    expect(metrics.criticalPersonnel[0]?.locationName).toBe('Forward base')
    expect(metrics.injuredOrDead).toBe(16)
    expect(metrics.noComms).toBe(8)
  })
})

describe('dashboard equipment totals', () => {
  it('applies defective, maintenance, limited, fair, and serviceable precedence', () => {
    const metrics = buildEquipmentMetrics([
      equipment('1', {
        condition_statuses: [{ name: 'Damaged' }],
        equipment_items: [{ name: 'Radio' }],
      }),
      equipment('2', {
        asset_statuses: { name: 'Under maintenance' },
        serviceability_statuses: { name: 'Serviceable' },
      }),
      equipment('3', {
        serviceability_statuses: [{ name: 'Limited serviceable' }],
      }),
      equipment('4', {
        condition_statuses: { name: 'Fair' },
        serviceability_statuses: { name: 'Serviceable' },
      }),
      equipment('5', { serviceability_statuses: { name: 'Serviceable' } }),
      equipment('6', {
        condition_statuses: [],
        asset_statuses: [],
        serviceability_statuses: [],
      }),
    ])

    expect(metrics.equipmentStatusOverview).toEqual({
      operational: 1,
      standbyReady: 1,
      partiallyOperational: 2,
      underMaintenance: 1,
      defective: 1,
    })
    expect(metrics.criticalEquipment[0]).toMatchObject({
      equipmentAssetId: '1',
      itemName: 'Radio',
    })
  })

  it('handles all relation forms and limits critical results', () => {
    const rows = [null, [], { name: 'Radio' }, [{ name: 'Vehicle' }]].map(
      (item, index) =>
        equipment(String(index), {
          equipment_items: item,
          asset_statuses: { name: 'Lost' },
        }),
    )
    rows.push(
      ...Array.from({ length: 4 }, (_, index) =>
        equipment(`extra-${index}`, {
          serviceability_statuses: { name: 'Unserviceable' },
        }),
      ),
    )
    const metrics = buildEquipmentMetrics(rows)

    expect(metrics.equipmentStatusOverview.defective).toBe(8)
    expect(metrics.criticalEquipment).toHaveLength(5)
    expect(
      metrics.criticalEquipment.map((item) => item.itemName).slice(0, 4),
    ).toEqual([
      'Unknown Equipment Item',
      'Unknown Equipment Item',
      'Radio',
      'Vehicle',
    ])
    expect(buildEquipmentMetrics([]).criticalEquipment).toEqual([])
  })
})
