export const ENGAGEMENT_MODULES = {
  engagements: 'engagement',
  engagementTypes: 'engagement',
} as const

export const ENGAGEMENT_PERMISSION_GROUPS = {
  engagementManagement: [
    'engagement.view',
    'engagement.create',
    'engagement.update',
    'engagement.delete',
    'engagement.manage',
  ],
} as const
