export const EQUIPMENT_INCIDENT_LIST_SELECT_COLUMNS =
  'id, incident_no, equipment_asset_id, personnel_id, deployment_id, incident_type_id, incident_date, location, location_latitude, location_longitude, description, investigation_status_id, resolution, remarks, created_at, updated_at, equipment_asset:equipment_assets(id, asset_tag, equipment_item:equipment_items(id, equipment_code, name)), personnel:personnel(id, personnel_code, first_name, middle_name, last_name), deployment:deployment_records(id, record_no, operation_name, deployment_area), incident_type:incident_types(id, code, name), investigation_status:investigation_statuses(id, name)'

export const INCIDENT_TYPE_SUGGESTION_SELECT_COLUMNS = 'id, code, name'

export const INVESTIGATION_STATUS_SUGGESTION_SELECT_COLUMNS = 'id, name'

export const EQUIPMENT_INCIDENT_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  incidentNo: 'incident_no',
  location: 'location',

})

export const INCIDENT_MUTATION_PERMISSION_CODES = [
  'equipment.maintain',
  'equipment.manage',
] as const

export const INCIDENT_DEFAULT_PAGE_SIZE = 10
export const INCIDENT_MAX_PAGE_SIZE = 100
export const INCIDENT_SUGGESTION_PAGE_SIZE = 20
