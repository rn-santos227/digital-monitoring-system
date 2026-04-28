# Supabase Schema Guide

Generated from all SQL files in `supabase/migrations` (through `20260414205218_expand-audit-logs-context.sql`).

- **Required** = `Yes` means column is non-nullable (`NOT NULL` or implied by `PRIMARY KEY`).
- **Type** reflects the declared PostgreSQL type.
- **Notes** captures defaults, keys, and foreign-key targets.

## `account_type_permissions`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `account_type_id` | Yes | `uuid` | FK → `public.account_types(id)`; on delete cascade |
| `permission_id` | Yes | `uuid` | FK → `public.permissions(id)`; on delete cascade |

Table constraints

- `unique (account_type_id, permission_id)`

## `account_types`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `code` | Yes | `text` | UNIQUE |
| `name` | Yes | `text` | UNIQUE |
| `description` | No | `text` | — |
| `is_system` | Yes | `boolean` | default `false` |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `asset_statuses`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `audit_logs`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `user_id` | No | `uuid` | FK → `public.user_profiles(id)`; on delete set null |
| `action` | Yes | `text` | — |
| `table_name` | Yes | `text` | — |
| `record_id` | No | `uuid` | — |
| `old_data` | No | `jsonb` | — |
| `new_data` | No | `jsonb` | — |
| `metadata` | No | `jsonb` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `request_data` | No | `jsonb` | — |
| `response_data` | No | `jsonb` | — |
| `request_headers` | No | `jsonb` | — |
| `ip_address` | No | `inet` | — |
| `status_code` | No | `integer` | — |

## `auth_sessions`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `user_id` | Yes | `uuid` | FK → `auth.users(id)`; on delete cascade |
| `access_token` | Yes | `text` | — |
| `refresh_token` | No | `text` | — |
| `provider` | Yes | `text` | — |
| `ip_address` | No | `text` | — |
| `user_agent` | No | `text` | — |
| `expires_at` | Yes | `timestamptz` | — |
| `revoked_at` | No | `timestamptz` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |

## `battalions`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `code` | Yes | `text` | UNIQUE |
| `name` | Yes | `text` | UNIQUE |
| `is_active` | Yes | `boolean` | default `true` |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `companies`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `battalion_id` | No | `uuid` | FK → `public.battalions(id)`; on delete restrict |
| `code` | Yes | `text` | UNIQUE |
| `name` | Yes | `text` | UNIQUE |
| `is_active` | Yes | `boolean` | default `true` |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `condition_statuses`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `deployment_records`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `record_no` | Yes | `text` | UNIQUE |
| `personnel_id` | Yes | `uuid` | FK → `public.personnel(id)`; on delete restrict |
| `deployment_area` | Yes | `text` | — |
| `assignment_role` | No | `text` | — |
| `operation_name` | No | `text` | — |
| `start_date` | Yes | `date` | — |
| `end_date` | No | `date` | — |
| `status_id` | Yes | `uuid` | FK → `public.deployment_statuses(id)`; on delete restrict |
| `location` | No | `text` | — |
| `supervisor_id` | No | `uuid` | FK → `public.personnel(id)`; on delete restrict |
| `remarks` | No | `text` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |
| `created_by` | No | `uuid` | FK → `public.user_profiles(id)`; on delete set null |

Table constraints

- `constraint deployment_records_date_check check (end_date is null or end_date >= start_date)`

## `deployment_statuses`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `employment_statuses`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `battalion_id` | No | `uuid` | FK → `public.battalions(id)`; on delete restrict |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `engagement_records`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `record_no` | Yes | `text` | UNIQUE |
| `personnel_id` | Yes | `uuid` | FK → `public.personnel(id)`; on delete restrict |
| `engagement_title` | Yes | `text` | — |
| `engagement_type_id` | Yes | `uuid` | FK → `public.engagement_types(id)`; on delete restrict |
| `level_id` | No | `uuid` | FK → `public.levels(id)`; on delete restrict |
| `date_start` | No | `date` | — |
| `date_end` | No | `date` | — |
| `status_id` | Yes | `uuid` | FK → `public.engagement_statuses(id)`; on delete restrict |
| `remarks` | No | `text` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |
| `created_by` | No | `uuid` | FK → `public.user_profiles(id)`; on delete set null |

### Table constraints

- `constraint engagement_records_date_check check (date_end is null or date_start is null or date_end >= date_start)`

## `engagement_statuses`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `engagement_types`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `equipment_assets`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `asset_tag` | Yes | `text` | UNIQUE |
| `equipment_item_id` | Yes | `uuid` | FK → `public.equipment_items(id)`; on delete restrict |
| `serial_no` | No | `text` | — |
| `batch_no` | No | `text` | — |
| `procurement_date` | No | `date` | — |
| `acquisition_cost` | No | `numeric(14,2)` | — |
| `fund_source` | No | `text` | — |
| `assigned_personnel_id` | No | `uuid` | FK → `public.personnel(id)`; on delete restrict |
| `assigned_company_id` | No | `uuid` | FK → `public.companies(id)`; on delete restrict |
| `assigned_battalion_id` | No | `uuid` | FK → `public.battalions(id)`; on delete restrict |
| `current_location` | No | `text` | — |
| `condition_status_id` | No | `uuid` | FK → `public.condition_statuses(id)`; on delete restrict |
| `serviceability_status_id` | No | `uuid` | FK → `public.serviceability_statuses(id)`; on delete restrict |
| `asset_status_id` | Yes | `uuid` | FK → `public.asset_statuses(id)`; on delete restrict |
| `remarks` | No | `text` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |
| `created_by` | No | `uuid` | FK → `public.user_profiles(id)`; on delete set null |

Table constraints

- `constraint equipment_assets_acquisition_cost_check check (acquisition_cost is null or acquisition_cost >= 0)`

## `equipment_categories`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `code` | Yes | `text` | UNIQUE |
| `name` | Yes | `text` | UNIQUE |
| `requires_serial` | Yes | `boolean` | default `false` |
| `is_consumable` | Yes | `boolean` | default `false` |
| `is_controlled` | Yes | `boolean` | default `false` |
| `is_active` | Yes | `boolean` | default `true` |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `equipment_incidents`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `incident_no` | Yes | `text` | UNIQUE |
| `equipment_asset_id` | Yes | `uuid` | FK → `public.equipment_assets(id)`; on delete restrict |
| `personnel_id` | No | `uuid` | FK → `public.personnel(id)`; on delete set null |
| `deployment_id` | No | `uuid` | FK → `public.deployment_records(id)`; on delete set null |
| `incident_type_id` | Yes | `uuid` | FK → `public.incident_types(id)`; on delete restrict |
| `incident_date` | Yes | `date` | — |
| `location` | No | `text` | — |
| `description` | Yes | `text` | — |
| `investigation_status_id` | No | `uuid` | FK → `public.investigation_statuses(id)`; on delete restrict |
| `resolution` | No | `text` | — |
| `remarks` | No | `text` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `equipment_issuances`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `issue_no` | Yes | `text` | UNIQUE |
| `equipment_asset_id` | Yes | `uuid` | FK → `public.equipment_assets(id)`; on delete restrict |
| `issued_to_personnel_id` | Yes | `uuid` | FK → `public.personnel(id)`; on delete restrict |
| `issued_by_personnel_id` | No | `uuid` | FK → `public.personnel(id)`; on delete restrict |
| `issue_date` | Yes | `date` | — |
| `expected_return_date` | No | `date` | — |
| `actual_return_date` | No | `date` | — |
| `issue_purpose` | No | `text` | — |
| `deployment_id` | No | `uuid` | FK → `public.deployment_records(id)`; on delete set null |
| `status_id` | Yes | `uuid` | FK → `public.issuance_statuses(id)`; on delete restrict |
| `condition_on_issue_id` | No | `uuid` | FK → `public.condition_statuses(id)`; on delete restrict |
| `condition_on_return_id` | No | `uuid` | FK → `public.condition_statuses(id)`; on delete restrict |
| `remarks` | No | `text` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |
| `created_by` | No | `uuid` | FK → `public.user_profiles(id)`; on delete set null |

Table constraints

- `constraint equipment_issuances_actual_return_date_check check (
    actual_return_date is null or actual_return_date >= issue_date
  )`
- `constraint equipment_issuances_expected_return_date_check check (
    expected_return_date is null or expected_return_date >= issue_date
  )`

## `equipment_items`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `equipment_code` | Yes | `text` | UNIQUE |
| `category_id` | Yes | `uuid` | FK → `public.equipment_categories(id)`; on delete restrict |
| `name` | Yes | `text` | — |
| `model` | No | `text` | — |
| `manufacturer` | No | `text` | — |
| `description` | No | `text` | — |
| `unit_of_measure` | No | `text` | — |
| `minimum_stock_level` | Yes | `integer` | default `0` |
| `is_serialized` | Yes | `boolean` | default `false` |
| `is_active` | Yes | `boolean` | default `true` |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

Table constraints

- `constraint equipment_items_minimum_stock_level_check check (minimum_stock_level >= 0)`

## `equipment_maintenance_records`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `maintenance_no` | Yes | `text` | UNIQUE |
| `equipment_asset_id` | Yes | `uuid` | FK → `public.equipment_assets(id)`; on delete restrict |
| `maintenance_type_id` | Yes | `uuid` | FK → `public.maintenance_types(id)`; on delete restrict |
| `reported_date` | No | `date` | — |
| `scheduled_date` | No | `date` | — |
| `completed_date` | No | `date` | — |
| `performed_by` | No | `text` | — |
| `cost` | No | `numeric(14,2)` | — |
| `findings` | No | `text` | — |
| `action_taken` | No | `text` | — |
| `resulting_condition_status_id` | No | `uuid` | FK → `public.condition_statuses(id)`; on delete restrict |
| `resulting_serviceability_status_id` | No | `uuid` | FK → `public.serviceability_statuses(id)`; on delete restrict |
| `remarks` | No | `text` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

Table constraints

- `constraint equipment_maintenance_records_cost_check check (cost is null or cost >= 0)`
- `constraint equipment_maintenance_records_completed_date_check check (
    completed_date is null or reported_date is null or completed_date >= reported_date
  )`

## `incident_types`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `code` | Yes | `text` | UNIQUE |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `investigation_statuses`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `issuance_statuses`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `levels`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `maintenance_types`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `permissions`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `code` | Yes | `text` | UNIQUE |
| `name` | Yes | `text` | — |
| `module` | Yes | `text` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |

## `personnel`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `personnel_code` | Yes | `text` | UNIQUE |
| `service_number` | Yes | `text` | UNIQUE |
| `last_name` | Yes | `text` | — |
| `first_name` | Yes | `text` | — |
| `middle_name` | No | `text` | — |
| `sex` | Yes | `text` | CHECK |
| `birthdate` | No | `date` | — |
| `rank_id` | Yes | `uuid` | FK → `public.ranks(id)`; on delete restrict |
| `company_id` | No | `uuid` | FK → `public.companies(id)`; on delete restrict |
| `battalion_id` | No | `uuid` | FK → `public.battalions(id)`; on delete restrict |
| `employment_status_id` | Yes | `uuid` | FK → `public.employment_statuses(id)`; on delete restrict |
| `service_status_id` | Yes | `uuid` | FK → `public.service_statuses(id)`; on delete restrict |
| `contact_number` | No | `text` | — |
| `date_enlisted` | No | `date` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |
| `created_by` | No | `uuid` | FK → `public.user_profiles(id)`; on delete set null |

## `personnel_medical_readiness`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `personnel_id` | Yes | `uuid` | FK → `public.personnel(id)`; on delete restrict |
| `medical_status` | Yes | `text` | — |
| `fit_for_deployment` | Yes | `boolean` | default `false` |
| `last_exam_date` | No | `date` | — |
| `next_exam_date` | No | `date` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

Table constraints

- `constraint personnel_medical_readiness_exam_date_check check (
    next_exam_date is null or last_exam_date is null or next_exam_date >= last_exam_date
  )`

## `personnel_qualifications`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `personnel_id` | Yes | `uuid` | FK → `public.personnel(id)`; on delete restrict |
| `qualification_type` | Yes | `text` | — |
| `date_obtained` | No | `date` | — |
| `valid_until` | No | `date` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

Table constraints

- `constraint personnel_qualifications_validity_check check (
    valid_until is null or date_obtained is null or valid_until >= date_obtained
  )`

## `personnel_weapon_assignments`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `personnel_id` | Yes | `uuid` | FK → `public.personnel(id)`; on delete restrict |
| `equipment_asset_id` | Yes | `uuid` | FK → `public.equipment_assets(id)`; on delete restrict |
| `assignment_date` | Yes | `date` | — |
| `relieved_date` | No | `date` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

Table constraints

- `constraint personnel_weapon_assignments_date_check check (
    relieved_date is null or relieved_date >= assignment_date
  )`

## `ranks`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `code` | Yes | `text` | UNIQUE |
| `name` | Yes | `text` | UNIQUE |
| `sort_order` | Yes | `integer` | default `0` |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `service_statuses`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `serviceability_statuses`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `training_categories`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `code` | Yes | `text` | UNIQUE |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `training_records`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `record_no` | Yes | `text` | UNIQUE |
| `personnel_id` | Yes | `uuid` | FK → `public.personnel(id)`; on delete restrict |
| `training_title` | Yes | `text` | — |
| `training_category_id` | No | `uuid` | FK → `public.training_categories(id)`; on delete restrict |
| `level_id` | No | `uuid` | FK → `public.levels(id)`; on delete restrict |
| `start_date` | No | `date` | — |
| `end_date` | No | `date` | — |
| `status_id` | Yes | `uuid` | FK → `public.training_statuses(id)`; on delete restrict |
| `certificate_no` | No | `text` | — |
| `valid_until` | No | `date` | — |
| `remarks` | No | `text` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |
| `created_by` | No | `uuid` | FK → `public.user_profiles(id)`; on delete set null |

Table constraints

- `constraint training_records_date_check check (end_date is null or start_date is null or end_date >= start_date)`
- `constraint training_records_valid_until_check check (valid_until is null or end_date is null or valid_until >= end_date)`

## `training_statuses`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `name` | Yes | `text` | UNIQUE |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |

## `user_account_types`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; default `gen_random_uuid()` |
| `user_id` | Yes | `uuid` | FK → `public.user_profiles(id)`; on delete cascade |
| `account_type_id` | Yes | `uuid` | FK → `public.account_types(id)`; on delete cascade |
| `assigned_at` | Yes | `timestamptz` | default `now()` |
| `assigned_by` | No | `uuid` | FK → `public.user_profiles(id)`; on delete set null |

Table constraints

- `unique (user_id, account_type_id)`

## `user_profiles`

| Field | Required | Type | Notes |
| --- | --- | --- | --- |
| `id` | Yes | `uuid` | PK; FK → `auth.users(id)`; on delete cascade |
| `personnel_id` | No | `uuid` | FK → `public.personnel(id)` |
| `email` | Yes | `text` | UNIQUE |
| `full_name` | Yes | `text` | — |
| `avatar_url` | No | `text` | — |
| `is_active` | Yes | `boolean` | default `true` |
| `last_login_at` | No | `timestamptz` | — |
| `created_at` | Yes | `timestamptz` | default `now()` |
| `updated_at` | Yes | `timestamptz` | default `now()` |
| `password_hash` | No | `text` | — |
| `password_updated_at` | No | `timestamptz` | — |
