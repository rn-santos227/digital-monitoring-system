export const ENGAGEMENT_MODULES = {
  engagements: 'engagement',
  engagementTypes: 'engagement',
} as const

export const ENGAGEMENT_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  engagementTitle: 'engagement_title',
  startDate: 'start_date',
  endDate: 'end_date',
  defaultRemarks: 'default_remarks',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

export const ENGAGEMENT_PERMISSION_GROUPS = {
  engagementManagement: [
    'engagement.view',
    'engagement.create',
    'engagement.update',
    'engagement.delete',
    'engagement.manage',
  ],
} as const
