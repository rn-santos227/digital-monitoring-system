export const MANAGEMENT_MODULES = {
  userManagement: 'user_management',
  accountTypeManagement: 'account_type_management',
} as const

export const MANAGEMENT_PERMISSION_GROUPS = {
  userProfileManagement: [
    'user.view',
    'user.create',
    'user.update',
    'user.delete',
  ],
  accountTypeManagement: [
    'account_type.view',
    'account_type.create',
    'account_type.update',
    'account_type.delete',
  ],
} as const
