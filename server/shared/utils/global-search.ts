import { GLOBAL_SEARCH_SUGGESTION_LIMIT } from '../constants'
import type {
  GlobalSearchAuthorizedUserPermissions,
  GlobalSearchEquipmentAssetRow,
  GlobalSearchIncidentRow,
  GlobalSearchPersonnelRow,
  GlobalSearchSuggestionItem,
} from '../models'

export const normalizeGlobalSearchText = (value: string) => value.trim().toLocaleLowerCase()

export const toSingleGlobalSearchReference = <T>(value: T | T[] | null): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export const joinGlobalSearchParts = (parts: Array<string | null | undefined>) => parts
  .map(part => part?.trim() ?? '')
  .filter(part => part.length > 0)
  .join(' • ')

export const calculateGlobalSearchSuggestionScore = (
  term: string,
  parts: Array<string | null | undefined>,
) => {
  const normalizedTerm = normalizeGlobalSearchText(term)
  const normalizedParts = parts
    .map(part => normalizeGlobalSearchText(part ?? ''))
    .filter(part => part.length > 0)
  const exactIndex = normalizedParts.findIndex(part => part === normalizedTerm)

  if (exactIndex >= 0) {
    return 1000 - exactIndex
  }

  const prefixIndex = normalizedParts.findIndex(part => part.startsWith(normalizedTerm))

  if (prefixIndex >= 0) {
    return 800 - prefixIndex
  }

  const containsIndex = normalizedParts.findIndex(part => part.includes(normalizedTerm))

  if (containsIndex >= 0) {
    const matchedPart = normalizedParts[containsIndex] ?? ''

    return 600 - containsIndex - Math.min(matchedPart.length, 200) / 1000
  }

  return 0
}

export const escapeGlobalSearchTerm = (term: string) => term
  .replaceAll('\\', '\\\\')
  .replaceAll('%', '\\%')
  .replaceAll('_', '\\_')
  .replaceAll(',', '\\,')

export const buildGlobalSearchOrFilter = (term: string, columns: readonly string[]) => {
  const escapedTerm = escapeGlobalSearchTerm(term)

  return columns.map(column => `${column}.ilike.%${escapedTerm}%`).join(',')
}

export const userHasGlobalSearchPermission = (
  user: GlobalSearchAuthorizedUserPermissions,
  permissionCode: string,
) => user.permission_codes.includes(permissionCode)


export const mapGlobalSearchPersonnelSuggestion = (
  term: string,
  row: GlobalSearchPersonnelRow,
): GlobalSearchSuggestionItem => {
  const parts = [
    row.personnel_code,
    row.service_number,
    row.full_name,
    row.email,
    row.rank_name,
    row.company_name,
    row.battalion_name,
    row.service_status,
  ]

  return {
    id: row.id,
    domain: 'personnel',
    title: row.full_name,
    subtitle: joinGlobalSearchParts([row.personnel_code, row.rank_name, row.company_name, row.service_status]),
    matchedText: joinGlobalSearchParts(parts),
    redirectTo: `/personnel/${row.id}`,
    score: calculateGlobalSearchSuggestionScore(term, parts),
  }
}

export const mapGlobalSearchEquipmentAssetSuggestion = (
  term: string,
  row: GlobalSearchEquipmentAssetRow,
): GlobalSearchSuggestionItem => {
  const equipmentItem = toSingleGlobalSearchReference(row.equipment_item)
  const parts = [
    row.asset_tag,
    row.serial_no,
    row.batch_no,
    equipmentItem?.equipment_code,
    equipmentItem?.name,
    row.current_location,
    row.remarks,
  ]

  return {
    id: row.id,
    domain: 'equipment',
    title: row.asset_tag,
    subtitle: joinGlobalSearchParts([equipmentItem?.name, equipmentItem?.equipment_code, row.current_location]),
    matchedText: joinGlobalSearchParts(parts),
    redirectTo: `/equipment-assets/${row.id}`,
    score: calculateGlobalSearchSuggestionScore(term, parts),
  }
}

export const mapGlobalSearchIncidentSuggestion = (
  term: string,
  row: GlobalSearchIncidentRow,
): GlobalSearchSuggestionItem => {
  const equipmentAsset = toSingleGlobalSearchReference(row.equipment_asset)
  const equipmentItem = toSingleGlobalSearchReference(equipmentAsset?.equipment_item ?? null)
  const incidentType = toSingleGlobalSearchReference(row.incident_type)
  const parts = [
    row.incident_no,
    incidentType?.name,
    row.incident_date,
    row.location,
    row.description,
    row.resolution,
    row.remarks,
    equipmentAsset?.asset_tag,
    equipmentItem?.equipment_code,
    equipmentItem?.name,
  ]

  return {
    id: row.id,
    domain: 'incident',
    title: row.incident_no,
    subtitle: joinGlobalSearchParts([incidentType?.name, row.incident_date, row.location, equipmentAsset?.asset_tag]),
    matchedText: joinGlobalSearchParts(parts),
    redirectTo: `/incidents/${row.id}`,
    score: calculateGlobalSearchSuggestionScore(term, parts),
  }
}
