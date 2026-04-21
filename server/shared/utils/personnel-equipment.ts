import type { PersonnelEquipmentAssetItemRow, PersonnelEquipmentAssetRow, PersonnelEquipmentIssuanceListRow } from '../models'
import type { PersonnelEquipmentIssuanceListItem } from '../responses'

const toSingleLinkedReference = (value: { name?: string | null } | { name?: string | null }[] | null) => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const toSingleEquipmentAsset = (
  value: PersonnelEquipmentAssetRow | PersonnelEquipmentAssetRow[] | null,
): PersonnelEquipmentAssetRow | null => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

const toSingleEquipmentAssetItem = (
  value: PersonnelEquipmentAssetItemRow | PersonnelEquipmentAssetItemRow[] | null | undefined,
): PersonnelEquipmentAssetItemRow | null => {
  if (!value) {
    return null
  }

  if (Array.isArray(value)) {
    return value[0] ?? null
  }

  return value
}

export const mapPersonnelEquipmentIssuanceListItem = (
  row: PersonnelEquipmentIssuanceListRow,
): PersonnelEquipmentIssuanceListItem => {
  const status = toSingleLinkedReference(row.issuance_status)
  const equipmentAsset = toSingleEquipmentAsset(row.equipment_asset)
  const equipmentItem = toSingleEquipmentAssetItem(equipmentAsset?.equipment_item)

  return {
    id: row.id,
    issueNo: row.issue_no,
    assetTag: equipmentAsset?.asset_tag ?? 'Unknown',
    equipmentItemName: equipmentItem?.name ?? 'Unknown',
    status: status?.name ?? 'Unknown',
    issueDate: row.issue_date,
    expectedReturnDate: row.expected_return_date,
    actualReturnDate: row.actual_return_date,
    issuePurpose: row.issue_purpose,
  }
}
