export const ACCOUNT_TYPE_PERMISSION_EMBEDDED_SELECT_COLUMNS =
  'permissions(id, code, name, module)'

export const ACCOUNT_TYPE_PERMISSIONS_SELECT_COLUMNS =
  `account_type_permissions(${ACCOUNT_TYPE_PERMISSION_EMBEDDED_SELECT_COLUMNS})`

export const ACCOUNT_TYPE_BASE_SELECT_COLUMNS =
  'id, code, name, description, is_system, created_at, updated_at'

export const ACCOUNT_TYPE_DETAIL_SELECT_COLUMNS =
  `id, code, name, description, is_system, ${ACCOUNT_TYPE_PERMISSIONS_SELECT_COLUMNS}`

export const ACCOUNT_TYPE_LIST_SELECT_COLUMNS =
  `${ACCOUNT_TYPE_BASE_SELECT_COLUMNS}, ${ACCOUNT_TYPE_PERMISSIONS_SELECT_COLUMNS}`

export const ACCOUNT_TYPE_PERMISSION_ID_SELECT_COLUMNS = 'permission_id'

export const ACCOUNT_TYPE_ASSIGNED_USER_COUNT_SELECT_COLUMNS =
  'id, user_profiles!inner(is_active)'

export const ID_ONLY_SELECT_COLUMNS = 'id'

export const USER_ACCOUNT_TYPE_ID_SELECT_COLUMNS = 'account_type_id'

export const USER_PROFILE_COMPACT_SELECT_COLUMNS =
  'id, email, full_name, is_active, last_login_at, user_account_types!user_account_types_user_id_fkey(account_types(code))'

export const USER_PROFILE_SUMMARY_SELECT_COLUMNS =
  'id, personnel_id, email, full_name, avatar_url, is_active, updated_at'

export const USER_PROFILE_DETAIL_SELECT_COLUMNS =
  'id, personnel_id, email, full_name, avatar_url, is_active, last_login_at, password_updated_at, created_at, updated_at, user_account_types!user_account_types_user_id_fkey(account_types(id, code, name))'

export const USER_PROFILE_PASSWORD_SELECT_COLUMNS =
  'id, email, is_active, password_updated_at'

export const USER_PROFILE_ACTIVATION_SELECT_COLUMNS =
  'id, email, full_name, is_active'

export const USER_PROFILE_PERSONNEL_LOOKUP_SELECT_COLUMNS =
  'id, personnel_id, email'

export const AUTH_SESSION_USER_ID_SELECT_COLUMNS = 'user_id'

export const PRIVILEGE_BASE_SELECT_COLUMNS = 'id, code, name, module'

export const AUDIT_LOG_LIST_SELECT_COLUMNS =
  'id, action, table_name, record_id, ip_address, status_code, created_at, user:user_profiles(full_name, email)'

export const AUDIT_LOG_DETAIL_SELECT_COLUMNS =
  'id, user_id, action, table_name, record_id, old_data, new_data, request_data, response_data, request_headers, ip_address, status_code, metadata, created_at, user:user_profiles(id, full_name, email, avatar_url, is_active)'

export const PERSONNEL_PROFILE_COMPACT_SELECT_COLUMNS =
  'id, personnel_code, service_number, full_name, rank_name, company_name, battalion_name, service_status'

export const PERSONNEL_PROFILE_LIST_SELECT_COLUMNS =
  'id, personnel_code, service_number, full_name, sex, rank_name, company_name, battalion_name, employment_status, service_status, created_at, updated_at'

export const PERSONNEL_PROFILE_DETAIL_SELECT_COLUMNS =
  'id, personnel_code, service_number, last_name, first_name, middle_name, sex, birthdate, rank_id, rank_code, rank_name, company_id, company_code, company_name, battalion_id, battalion_code, battalion_name, employment_status_id, employment_status, service_status_id, service_status, contact_number, date_enlisted, created_at, updated_at'

export const PERSONNEL_PROFILE_SUMMARY_SELECT_COLUMNS =
  'id, personnel_code, service_number, last_name, first_name, middle_name, sex, birthdate, rank_id, company_id, battalion_id, employment_status_id, service_status_id, contact_number, date_enlisted, created_at, updated_at'

export const PERSONNEL_REFERENCE_ID_SELECT_COLUMNS = 'id'

export const PERSONNEL_TRAINING_RECORD_LIST_SELECT_COLUMNS =
  'id, training_title, start_date, end_date, valid_until, remarks, training_category:training_categories(name), training_status:training_statuses(name)'

export const PERSONNEL_DEPLOYMENT_RECORD_LIST_SELECT_COLUMNS =
  'id, deployment_area, operation_name, start_date, end_date, location, assignment_role, deployment_status:deployment_statuses(name)'

export const PERSONNEL_ENGAGEMENT_RECORD_LIST_SELECT_COLUMNS =
  'id, engagement_title, date_start, date_end, remarks, engagement_type:engagement_types(name), engagement_status:engagement_statuses(name)'

export const PERSONNEL_EQUIPMENT_ISSUANCE_LIST_SELECT_COLUMNS =
  'id, issue_no, issue_date, expected_return_date, actual_return_date, issue_purpose, issuance_status:issuance_statuses(name), equipment_asset:equipment_assets(asset_tag, equipment_item:equipment_items(name))'

export const PERSONNEL_SUGGESTION_SELECT_COLUMNS =
  'id, personnel_code, service_number, full_name, rank_name, company_name, battalion_name, service_status'

export const RANK_LIST_SELECT_COLUMNS = 'id, code, name, sort_order, created_at, updated_at'
export const RANK_SUGGESTION_SELECT_COLUMNS = 'id, code, name, sort_order'
export const RANK_REFERENCE_ID_SELECT_COLUMNS = 'id'

export const BATTALION_SELECT_COLUMNS = 'id, code, name, is_active, created_at, updated_at'
export const BATTALION_SUGGESTION_SELECT_COLUMNS = 'id, code, name, is_active'
export const BATTALION_REFERENCE_ID_SELECT_COLUMNS = 'id'

export const COMPANY_BASE_SELECT_COLUMNS = 'id, battalion_id, code, name, is_active, created_at, updated_at'

export const COMPANY_BATTALION_EMBEDDED_SELECT_COLUMNS = 'battalion:battalions(id, code, name)'

export const COMPANY_SELECT_COLUMNS =
  `${COMPANY_BASE_SELECT_COLUMNS}, ${COMPANY_BATTALION_EMBEDDED_SELECT_COLUMNS}`

export const COMPANY_SUGGESTION_SELECT_COLUMNS =
  `id, battalion_id, code, name, is_active, ${COMPANY_BATTALION_EMBEDDED_SELECT_COLUMNS}`

export const BATTALION_COMPANY_LIST_SELECT_COLUMNS = COMPANY_SELECT_COLUMNS
export const BATTALION_PERSONNEL_LIST_SELECT_COLUMNS = PERSONNEL_PROFILE_COMPACT_SELECT_COLUMNS
export const COMPANY_PERSONNEL_LIST_SELECT_COLUMNS = PERSONNEL_PROFILE_COMPACT_SELECT_COLUMNS

export const UNIT_EQUIPMENT_ASSET_LIST_SELECT_COLUMNS =
  'equipment_asset_id, asset_tag, serial_no, equipment_code, item_name, category_code, category_name, assigned_personnel_code, assigned_personnel_last_name, assigned_personnel_first_name, assigned_company_code, assigned_company_name, assigned_battalion_code, assigned_battalion_name, current_location, condition_status, serviceability_status, asset_status, latest_issue_no, latest_issue_date, latest_issuance_status'

export const TRAINING_CATEGORY_SELECT_COLUMNS = 'id, code, name, created_at, updated_at'
export const TRAINING_CATEGORY_SUGGESTION_SELECT_COLUMNS = 'id, code, name'
export const TRAINING_REFERENCE_ID_SELECT_COLUMNS = 'id'
export const TRAINING_SELECT_COLUMNS = 'id, training_title, training_category_id, level_id, start_date, end_date, status_id, default_remarks, created_at, updated_at, training_category:training_categories(id, code, name), level:levels(id, name), training_status:training_statuses(id, name)'
export const TRAINING_SUGGESTION_SELECT_COLUMNS = 'id, training_title, start_date, end_date, training_category:training_categories(id, name), level:levels(id, name), training_status:training_statuses(id, name)'
