import type { EquipmentAssetKpiCounts, EquipmentAssetListItem } from '~/types/domain/equipment'

export const isIssuedEquipmentAsset = (asset: Pick<EquipmentAssetListItem, 'assetStatusName'> | null | undefined) => {
  return asset?.assetStatusName.toLowerCase().includes('issued') ?? false
}

export const applyEquipmentAssetKpiDelta = (
  kpis: EquipmentAssetKpiCounts,
  asset: EquipmentAssetListItem,
  delta: 1 | -1,
): EquipmentAssetKpiCounts => {
  const totalAssets = Math.max(0, kpis.totalAssets + delta)
  const issuedAssets = Math.max(0, kpis.issuedAssets + (isIssuedEquipmentAsset(asset) ? delta : 0))

  return {
    totalAssets,
    issuedAssets,
    notIssuedAssets: Math.max(0, totalAssets - issuedAssets),
  }
}

export const applyEquipmentAssetStatusTransition = (
  kpis: EquipmentAssetKpiCounts,
  previousAsset: EquipmentAssetListItem,
  nextAsset: EquipmentAssetListItem,
): EquipmentAssetKpiCounts => {
  const wasIssued = isIssuedEquipmentAsset(previousAsset)
  const isIssued = isIssuedEquipmentAsset(nextAsset)

  if (wasIssued === isIssued) {
    return kpis
  }

  const issuedAssets = Math.max(0, kpis.issuedAssets + (isIssued ? 1 : -1))

  return {
    totalAssets: kpis.totalAssets,
    issuedAssets,
    notIssuedAssets: Math.max(0, kpis.totalAssets - issuedAssets),
  }
}
