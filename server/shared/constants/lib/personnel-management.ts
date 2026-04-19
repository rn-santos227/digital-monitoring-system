export const PERSONNEL_MODULES = {
  personnelManagement: 'personnel',
} as const

export const PERSONNEL_PERMISSION_GROUPS = {
  personnelManagement: [
    'personnel.view',
    'personnel.create',
    'personnel.update',
    'personnel.delete',
  ],
} as const
