export const SEX_VALUES = Object.freeze(['Male', 'Female'] as const)
export type Sex = (typeof SEX_VALUES)[number]

export const EMPLOYMENT_STATUS_VALUES = Object.freeze([
  'Regular',
  'Contractual',
  'Probationary',
  'Separated',
] as const)
export type EmploymentStatusName = (typeof EMPLOYMENT_STATUS_VALUES)[number]

export const SERVICE_STATUS_VALUES = Object.freeze([
  'Active Duty',
  'Deployed',
  'Unavailable',
  'Standby-Alert',
  'Injured',
  'Dead',
  'Reserve',
  'Detached',
  'On Leave',
  'Retired',
] as const)
export type ServiceStatusName = (typeof SERVICE_STATUS_VALUES)[number]

export const LEVEL_VALUES = Object.freeze([
  'Local',
  'National',
  'International',
] as const)
export type LevelName = (typeof LEVEL_VALUES)[number]

export const DEPLOYMENT_STATUS_VALUES = Object.freeze([
  'Planned',
  'Active',
  'Completed',
  'Cancelled',
] as const)
export type DeploymentStatusName = (typeof DEPLOYMENT_STATUS_VALUES)[number]

export const TRAINING_STATUS_VALUES = Object.freeze([
  'Planned',
  'Ongoing',
  'Completed',
  'Expired',
  'Cancelled',
] as const)
export type TrainingStatusName = (typeof TRAINING_STATUS_VALUES)[number]

export const ENGAGEMENT_STATUS_VALUES = Object.freeze([
  'Planned',
  'Ongoing',
  'Completed',
  'Cancelled',
] as const)
export type EngagementStatusName = (typeof ENGAGEMENT_STATUS_VALUES)[number]

export const ENGAGEMENT_TYPE_VALUES = Object.freeze([
  'Seminar',
  'Conference',
  'Joint Exercise',
  'Community Operation',
  'Official Representation',
] as const)
export type EngagementTypeName = (typeof ENGAGEMENT_TYPE_VALUES)[number]

export const CONDITION_STATUS_VALUES = Object.freeze([
  'Excellent',
  'Good',
  'Fair',
  'Damaged',
] as const)
export type ConditionStatusName = (typeof CONDITION_STATUS_VALUES)[number]

export const SERVICEABILITY_STATUS_VALUES = Object.freeze([
  'Serviceable',
  'Limited Serviceability',
  'Unserviceable',
] as const)
export type ServiceabilityStatusName = (typeof SERVICEABILITY_STATUS_VALUES)[number]

export const ASSET_STATUS_VALUES = Object.freeze([
  'In Stock',
  'Issued',
  'Lost',
  'Under Repair',
  'Condemned',
] as const)
export type AssetStatusName = (typeof ASSET_STATUS_VALUES)[number]
export type IssuanceStatusName = 'Issued' | 'Returned' | 'Overdue'
export type MaintenanceTypeName = 'Preventive' | 'Corrective' | 'Inspection' | 'Calibration'
export type InvestigationStatusName = 'Reported' | 'Under Investigation' | 'Resolved' | 'Closed'

export const APP_THEME_VALUES = Object.freeze([
  'light',
  'dark',
  'amber',
  'azure',
  'emerald',
  'brown',
] as const)
export type AppTheme = (typeof APP_THEME_VALUES)[number]

export const TIMEZONE_VALUES = Object.freeze([
  'UTC',
  'Asia/Manila',
  'Asia/Singapore',
  'Asia/Tokyo',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
] as const)
export type Timezone = (typeof TIMEZONE_VALUES)[number]

export const PAGE_SIZE_VALUES = Object.freeze([10, 20, 25, 50, 100] as const)
export type PageSize = (typeof PAGE_SIZE_VALUES)[number]

export const DATE_FORMAT_VALUES = Object.freeze([
  'yyyy-MM-dd',
  'MM/dd/yyyy',
  'dd/MM/yyyy',
  'dd-MM-yyyy',
  'MMMM d, yyyy',
  'EEE, MMM d, yyyy',
] as const)
export type DateFormat = (typeof DATE_FORMAT_VALUES)[number]

export const TIME_FORMAT_OPTIONS = Object.freeze([
  { value: '12h', label: '12-hour' },
  { value: '24h', label: '24-hour' },
] as const)

export const DENSITY_OPTIONS = Object.freeze([
  { value: 'compact', label: 'Compact' },
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'spacious', label: 'Spacious' },
] as const)
