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

export const TRAINING_LEVEL_VALUES = Object.freeze([
  'Beginner',
  'Intermediate',
  'Advanced',
  'Specialized',
  'Instructor',
] as const)
export type TrainingLevelName = (typeof TRAINING_LEVEL_VALUES)[number]

export type TrainingStatusName = 'Planned' | 'Ongoing' | 'Completed' | 'Expired' | 'Cancelled'
export type DeploymentStatusName = 'Planned' | 'Active' | 'Completed' | 'Cancelled'
export type EngagementStatusName = 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled'

export type EngagementTypeName =
  | 'Seminar'
  | 'Conference'
  | 'Joint Exercise'
  | 'Community Operation'
  | 'Official Representation'

export type ConditionStatusName = 'Excellent' | 'Good' | 'Fair' | 'Damaged'
export type ServiceabilityStatusName = 'Serviceable' | 'Limited Serviceability' | 'Unserviceable'
export type AssetStatusName = 'In Stock' | 'Issued' | 'Lost' | 'Under Repair' | 'Condemned'
export type IssuanceStatusName = 'Issued' | 'Returned' | 'Overdue'
export type MaintenanceTypeName = 'Preventive' | 'Corrective' | 'Inspection' | 'Calibration'
export type InvestigationStatusName = 'Reported' | 'Under Investigation' | 'Resolved' | 'Closed'
