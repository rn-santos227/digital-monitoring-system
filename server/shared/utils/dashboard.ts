import type {
  DashboardCriticalEquipmentItem,
  DashboardCriticalPersonnelItem,
  DashboardEquipmentStatusSummary,
  DashboardLocationLoadItem,
  DashboardLocationLoadLevel,
  DashboardStatusCountSummary,
} from '../responses'

const HEAVY_LOAD_THRESHOLD = 0.7
const MODERATE_LOAD_THRESHOLD = 0.35
const PERSONNEL_CRITICAL_LIMIT = 5
const EQUIPMENT_CRITICAL_LIMIT = 5

export interface DashboardPersonnelStatusRow {
  id: string
  first_name: string
  last_name: string
  contact_number: string | null
  battalion_name: string | null
  service_status_name: string | null
}

export interface DashboardEquipmentStatusRow {
  id: string
  asset_tag: string
  condition_statuses: { name: string } | { name: string }[] | null
  serviceability_statuses: { name: string } | { name: string }[] | null
  asset_statuses: { name: string } | { name: string }[] | null
  equipment_items: { name: string } | { name: string }[] | null
}

export const calculateLocationLoadLevel = (totalPersonnel: number, deployedPersonnel: number): DashboardLocationLoadLevel => {
  if (totalPersonnel <= 0) {
    return 'light'
  }

  const loadRatio = deployedPersonnel / totalPersonnel

  if (loadRatio >= HEAVY_LOAD_THRESHOLD) {
    return 'heavy'
  }

  if (loadRatio >= MODERATE_LOAD_THRESHOLD) {
    return 'moderate'
  }

  return 'light'
}

export const normalizeStatusName = (value: string | null | undefined): string => {
  return value?.trim().toLowerCase() ?? ''
}

export const isInjuredStatus = (statusName: string): boolean => {
  const normalizedStatus = normalizeStatusName(statusName)

  return normalizedStatus.includes('injured') || normalizedStatus.includes('wounded')
}

export const isDeadStatus = (statusName: string): boolean => {
  const normalizedStatus = normalizeStatusName(statusName)

  return normalizedStatus.includes('dead') || normalizedStatus.includes('killed') || normalizedStatus.includes('kia')
}

export const isStandbyStatus = (statusName: string): boolean => {
  const normalizedStatus = normalizeStatusName(statusName)

  return normalizedStatus.includes('standby') || normalizedStatus.includes('reserve') || normalizedStatus.includes('planned')
}

export const isUnavailableStatus = (statusName: string): boolean => {
  const normalizedStatus = normalizeStatusName(statusName)

  return normalizedStatus.includes('leave') || normalizedStatus.includes('detached') || normalizedStatus.includes('retired')
}

export const isOperationalEquipment = (statusName: string): boolean => {
  const normalizedStatus = normalizeStatusName(statusName)

  return normalizedStatus.includes('serviceable') && !normalizedStatus.includes('limited')
}

export const isStandbyReadyEquipment = (statusName: string): boolean => {
  const normalizedStatus = normalizeStatusName(statusName)

  return normalizedStatus.includes('limited')
}

export const isDefectiveEquipment = (value: string): boolean => {
  const normalizedValue = normalizeStatusName(value)

  return normalizedValue.includes('damaged')
    || normalizedValue.includes('unserviceable')
    || normalizedValue.includes('condemned')
    || normalizedValue.includes('lost')
}

export const isUnderMaintenanceEquipment = (value: string): boolean => {
  const normalizedValue = normalizeStatusName(value)

  return normalizedValue.includes('repair') || normalizedValue.includes('maintenance')
}

export const toFullName = (firstName: string | null | undefined, lastName: string | null | undefined): string => {
  const safeFirstName = firstName?.trim() ?? ''
  const safeLastName = lastName?.trim() ?? ''

  return `${safeFirstName} ${safeLastName}`.trim() || 'Unknown Personnel'
}

const toEquipmentItem = (value: DashboardEquipmentStatusRow['equipment_items']): { name: string } | null => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export interface DashboardPersonnelSummaryMetrics {
  totalRegistered: number
  deployed: number
  standbyAlert: number
  noComms: number
  injuredOrDead: number
  personnelDeploymentSummary: DashboardStatusCountSummary
  locationLoadAnalysis: DashboardLocationLoadItem[]
  criticalPersonnel: DashboardCriticalPersonnelItem[]
}

export const buildPersonnelSummaryMetrics = (
  personnelRows: DashboardPersonnelStatusRow[],
  activeDeploymentPersonnelIds: Set<string>,
): DashboardPersonnelSummaryMetrics => {
  const personnelDeploymentSummary: DashboardStatusCountSummary = {
    deployed: 0,
    unavailable: 0,
    standbyAlert: 0,
    injured: 0,
    dead: 0,
  }

  let noComms = 0
  const criticalPersonnel: DashboardCriticalPersonnelItem[] = []
  const battalionCounters = new Map<string, { totalPersonnel: number; deployedPersonnel: number }>()

  for (const row of personnelRows) {
    const statusName = row.service_status_name ?? ''
    const isDeployed = activeDeploymentPersonnelIds.has(row.id)

    if (isDeployed) {
      personnelDeploymentSummary.deployed += 1
    }

    if (isStandbyStatus(statusName)) {
      personnelDeploymentSummary.standbyAlert += 1
    }

    if (isUnavailableStatus(statusName)) {
      personnelDeploymentSummary.unavailable += 1
    }

    if (isInjuredStatus(statusName)) {
      personnelDeploymentSummary.injured += 1

      if (criticalPersonnel.length < PERSONNEL_CRITICAL_LIMIT) {
        criticalPersonnel.push({
          personnelId: row.id,
          fullName: toFullName(row.first_name, row.last_name),
          issue: 'Injured personnel status flagged.',
        })
      }
    }

    if (isDeadStatus(statusName)) {
      personnelDeploymentSummary.dead += 1

      if (criticalPersonnel.length < PERSONNEL_CRITICAL_LIMIT) {
        criticalPersonnel.push({
          personnelId: row.id,
          fullName: toFullName(row.first_name, row.last_name),
          issue: 'Dead personnel status flagged.',
        })
      }
    }

    if (!(row.contact_number?.trim())) {
      noComms += 1
    }

    const battalionName = row.battalion_name?.trim() || 'Unassigned Battalion'
    const battalionCounter = battalionCounters.get(battalionName) ?? {
      totalPersonnel: 0,
      deployedPersonnel: 0,
    }

    battalionCounter.totalPersonnel += 1

    if (isDeployed) {
      battalionCounter.deployedPersonnel += 1
    }

    battalionCounters.set(battalionName, battalionCounter)
  }

  const locationLoadAnalysis: DashboardLocationLoadItem[] = Array.from(battalionCounters.entries())
    .map(([locationName, counts]) => ({
      locationName,
      totalPersonnel: counts.totalPersonnel,
      deployedPersonnel: counts.deployedPersonnel,
      loadLevel: calculateLocationLoadLevel(counts.totalPersonnel, counts.deployedPersonnel),
    }))
    .sort((left, right) => left.locationName.localeCompare(right.locationName))

  return {
    totalRegistered: personnelRows.length,
    deployed: personnelDeploymentSummary.deployed,
    standbyAlert: personnelDeploymentSummary.standbyAlert,
    noComms,
    injuredOrDead: personnelDeploymentSummary.injured + personnelDeploymentSummary.dead,
    personnelDeploymentSummary,
    locationLoadAnalysis,
    criticalPersonnel,
  }
}

export interface DashboardEquipmentMetrics {
  equipmentStatusOverview: DashboardEquipmentStatusSummary
  criticalEquipment: DashboardCriticalEquipmentItem[]
}

export const buildEquipmentMetrics = (equipmentRows: DashboardEquipmentStatusRow[]): DashboardEquipmentMetrics => {
  const equipmentStatusOverview: DashboardEquipmentStatusSummary = {
    operational: 0,
    standbyReady: 0,
    partiallyOperational: 0,
    underMaintenance: 0,
    defective: 0,
  }

  const criticalEquipment: DashboardCriticalEquipmentItem[] = []

  for (const equipmentRow of equipmentRows) {
    const conditionName = Array.isArray(equipmentRow.condition_statuses)
      ? (equipmentRow.condition_statuses[0]?.name ?? '')
      : (equipmentRow.condition_statuses?.name ?? '')
    const serviceabilityName = Array.isArray(equipmentRow.serviceability_statuses)
      ? (equipmentRow.serviceability_statuses[0]?.name ?? '')
      : (equipmentRow.serviceability_statuses?.name ?? '')
    const assetStatusName = Array.isArray(equipmentRow.asset_statuses)
      ? (equipmentRow.asset_statuses[0]?.name ?? '')
      : (equipmentRow.asset_statuses?.name ?? '')

    const hasDefectiveStatus = isDefectiveEquipment(conditionName)
      || isDefectiveEquipment(serviceabilityName)
      || isDefectiveEquipment(assetStatusName)

    if (hasDefectiveStatus) {
      equipmentStatusOverview.defective += 1

      if (criticalEquipment.length < EQUIPMENT_CRITICAL_LIMIT) {
        const item = toEquipmentItem(equipmentRow.equipment_items)

        criticalEquipment.push({
          equipmentAssetId: equipmentRow.id,
          assetTag: equipmentRow.asset_tag,
          itemName: item?.name ?? 'Unknown Equipment Item',
          issue: 'Equipment marked as damaged, unserviceable, condemned, or lost.',
        })
      }

      continue
    }

    if (isUnderMaintenanceEquipment(assetStatusName)) {
      equipmentStatusOverview.underMaintenance += 1
      continue
    }

    if (isStandbyReadyEquipment(serviceabilityName)) {
      equipmentStatusOverview.standbyReady += 1
      continue
    }

    if (normalizeStatusName(conditionName) === 'fair') {
      equipmentStatusOverview.partiallyOperational += 1
      continue
    }

    if (isOperationalEquipment(serviceabilityName)) {
      equipmentStatusOverview.operational += 1
      continue
    }

    equipmentStatusOverview.partiallyOperational += 1
  }

  return {
    equipmentStatusOverview,
    criticalEquipment,
  }
}
