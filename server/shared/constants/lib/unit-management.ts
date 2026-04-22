export const UNIT_MODULES = {
  battalionManagement: 'battalion',
  companyManagement: 'company',
} as const

export const UNIT_PERMISSION_GROUPS = {
  battalionManagement: [
    'battalion.view',
    'battalion.create',
    'battalion.update',
    'battalion.delete',
  ],
  companyManagement: [
    'company.view',
    'company.create',
    'company.update',
    'company.delete',
  ],
} as const
