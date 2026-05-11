import type { PersonnelKpiCounts, PersonnelListCompactItem } from '~/types/domain/personnel'

export const isDeployedPersonnel = (item: Pick<PersonnelListCompactItem, 'serviceStatus'> | null | undefined) => {
  return item?.serviceStatus.trim().toLowerCase().includes('deployed') ?? false
}

export const applyPersonnelKpiDelta = (
  kpis: PersonnelKpiCounts,
  item: PersonnelListCompactItem,
  delta: 1 | -1,
): PersonnelKpiCounts => {
  const totalPersonnel = Math.max(0, kpis.totalPersonnel + delta)
  const deployedPersonnel = Math.max(0, kpis.deployedPersonnel + (isDeployedPersonnel(item) ? delta : 0))

  return {
    ...kpis,
    totalPersonnel,
    deployedPersonnel,
  }
}

export const applyPersonnelDeploymentTransition = (
  kpis: PersonnelKpiCounts,
  previousItem: PersonnelListCompactItem,
  nextItem: Pick<PersonnelListCompactItem, 'serviceStatus'>,
): PersonnelKpiCounts => {
  const wasDeployed = isDeployedPersonnel(previousItem)
  const isDeployed = isDeployedPersonnel(nextItem)

  if (wasDeployed === isDeployed) {
    return kpis
  }

  return {
    ...kpis,
    deployedPersonnel: Math.max(0, kpis.deployedPersonnel + (isDeployed ? 1 : -1)),
  }
}
