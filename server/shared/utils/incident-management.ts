import type {
  EquipmentIncidentListItem,
  EquipmentIncidentRow,
  IncidentPersonnelReference,
} from '../models'

const toSingleReference = <T>(value: T | T[] | null): T | null => {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const formatPersonnelName = (personnel: IncidentPersonnelReference | null): string | null => {
  if (!personnel) {
    return null
  }

  const givenNames = [personnel.first_name, personnel.middle_name]
    .filter((part): part is string => Boolean(part?.trim()))
    .join(' ')

  return [personnel.last_name, givenNames]
    .filter(part => part.trim().length > 0)
    .join(', ')
}

export const mapEquipmentIncidentListItem = (
  row: EquipmentIncidentRow,
): EquipmentIncidentListItem => {
  const equipmentAsset = toSingleReference(row.equipment_asset)
  const equipmentItem = toSingleReference(equipmentAsset?.equipment_item ?? null)
  const personnel = toSingleReference(row.personnel)
  const deployment = toSingleReference(row.deployment)
  const incidentType = toSingleReference(row.incident_type)
  const investigationStatus = toSingleReference(row.investigation_status)

  return {
    id: row.id,
    incidentNo: row.incident_no,
    equipmentAssetId: row.equipment_asset_id,
    assetTag: equipmentAsset?.asset_tag ?? '',
    equipmentCode: equipmentItem?.equipment_code ?? null,
    equipmentName: equipmentItem?.name ?? null,
    personnelId: row.personnel_id,
    personnelCode: personnel?.personnel_code ?? null,
    personnelName: formatPersonnelName(personnel),

  }
}

