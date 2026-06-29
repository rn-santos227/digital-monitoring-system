export const GLOBAL_SEARCH_SUGGESTION_LIMIT = 10

export const GLOBAL_SEARCH_PERSONNEL_SELECT_COLUMNS =
  'id, personnel_code, service_number, email, full_name, rank_name, company_name, battalion_name, service_status'

export const GLOBAL_SEARCH_EQUIPMENT_ASSET_SELECT_COLUMNS =
  'id, asset_tag, serial_no, batch_no, current_location, remarks, equipment_item:equipment_items(equipment_code, name)'

export const GLOBAL_SEARCH_INCIDENT_SELECT_COLUMNS =
  'id, incident_no, incident_date, location, description, resolution, remarks, equipment_asset:equipment_assets(asset_tag, equipment_item:equipment_items(equipment_code, name)), incident_type:incident_types(name)'
