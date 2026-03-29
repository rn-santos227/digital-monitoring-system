export type Sex = 'Male' | 'Female'

export type ServiceStatusName =
  | 'Active Duty'
  | 'Reserve'
  | 'Detached'
  | 'On Leave'
  | 'Retired'

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
