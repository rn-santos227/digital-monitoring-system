export const MANAGEMENT_MODULES = {
  userManagement: 'user_management',
  accountTypeManagement: 'account_type_management',
} as const

export const USER_PROFILE_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  email: 'email',
  fullName: 'full_name',
})

export const ACCOUNT_TYPE_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  code: 'code',
  name: 'name',
  description: 'description',
})

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
