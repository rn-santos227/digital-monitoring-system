export const BACKUP_FORMAT_VERSION = 1
export const BACKUP_PAGE_SIZE = 1_000
export const BACKUP_FILE_PREFIX = 'digital-afp-monitoring-backup'

export const BACKUP_TABLES = Object.freeze([
  'ranks',
  'battalions',
  'companies',
  'employment_statuses',
  'service_statuses',
  'levels',
  'training_categories',
  'training_statuses',
  'deployment_statuses',
  'engagement_types',
  'engagement_statuses',
  'condition_statuses',
  'serviceability_statuses',
  'asset_statuses',
  'issuance_statuses',
  'maintenance_types',
  'incident_types',
  'investigation_statuses',
  'personnel',
  'trainings',
  'training_records',
  'deployments',
  'deployment_records',
  'engagements',
  'engagement_records',
  'equipment_categories',
  'equipment_items',
  'equipment_assets',
  'equipment_issuances',
  'equipment_maintenance_records',
  'equipment_incidents',
  'personnel_qualifications',
  'personnel_medical_readiness',
  'personnel_weapon_assignments',
  'application_settings',
  'user_profiles',

])

export type BackupTableName = (typeof BACKUP_TABLES)[number]
