export const UNIT_MODULES = {
  battalionManagement: 'battalion',
  companyManagement: 'company',
} as const

export const BATTALION_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  code: 'code',
  name: 'name',
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})

export const COMPANY_SEARCHABLE_FIELD_COLUMNS = Object.freeze({
  code: 'code',
  name: 'name',
})

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
