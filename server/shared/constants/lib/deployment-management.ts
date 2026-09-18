export const DEPLOYMENT_MODULES = {
  deployments: 'deployment',
  deploymentRecords: 'deployment',
} as const

export const DEPLOYMENT_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  operationName: 'operation_name',
  deploymentArea: 'deployment_area',
  assignmentRole: 'assignment_role',
  location: 'location',
  remarks: 'default_remarks',
  startDate: 'start_date',
  endDate: 'end_date',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

export const DEPLOYMENT_RECORD_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  recordNo: 'record_no',
  operationName: 'operation_name',
  deploymentArea: 'deployment_area',
  assignmentRole: 'assignment_role',
  location: 'location',
  remarks: 'remarks',
  startDate: 'start_date',
  endDate: 'end_date',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

export const DEPLOYMENT_PERMISSION_GROUPS = {
  deploymentManagement: [
    'deployment.view',
    'deployment.create',
    'deployment.update',
    'deployment.delete',
    'deployment.manage',
  ],
} as const
