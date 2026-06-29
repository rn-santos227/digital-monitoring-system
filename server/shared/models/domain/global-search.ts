export type GlobalSearchSuggestionDomain = 'personnel' | 'equipment' | 'incident'

export interface GlobalSearchSuggestionItem {
  id: string
  domain: GlobalSearchSuggestionDomain
  title: string
  subtitle: string
  matchedText: string
  redirectTo: string
  score: number
}

export interface GlobalSearchAuthorizedUserPermissions {
  permission_codes: string[]
}

export interface GlobalSearchPersonnelRow {
  id: string
  personnel_code: string
  service_number: string
  email: string | null
  full_name: string
  rank_name: string
  company_name: string | null
  battalion_name: string | null
  service_status: string
}

export interface GlobalSearchEquipmentItemRow {
  equipment_code: string
  name: string
}

export interface GlobalSearchEquipmentAssetRow {
  id: string
  asset_tag: string
  serial_no: string | null
  batch_no: string | null
  current_location: string | null
  remarks: string | null
  equipment_item: GlobalSearchEquipmentItemRow | GlobalSearchEquipmentItemRow[] | null
}

export interface GlobalSearchIncidentTypeRow {
  name: string
}

export interface GlobalSearchIncidentAssetRow {
  asset_tag: string
  equipment_item: GlobalSearchEquipmentItemRow | GlobalSearchEquipmentItemRow[] | null
}

export interface GlobalSearchIncidentRow {
  id: string
  incident_no: string
  incident_date: string
  location: string | null
  description: string
  resolution: string | null
  remarks: string | null
  equipment_asset: GlobalSearchIncidentAssetRow | GlobalSearchIncidentAssetRow[] | null
  incident_type: GlobalSearchIncidentTypeRow | GlobalSearchIncidentTypeRow[] | null
}
