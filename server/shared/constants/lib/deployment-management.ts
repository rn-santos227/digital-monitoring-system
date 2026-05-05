export const DEPLOYMENT_MODULES = {
  deployments: 'deployment',
  deploymentRecords: 'deployment',
} as const

export const DEPLOYMENT_PERMISSION_GROUPS = {
  deploymentManagement: [
    'deployment.view',
    'deployment.create',
    'deployment.update',
    'deployment.delete',
    'deployment.manage',
  ],
} as const
