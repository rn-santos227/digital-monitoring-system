export const MAX_BULK_MUTATION_ITEMS = 100

export const BULK_UPDATE_PROTECTED_COLUMNS: Readonly<
  Record<string, readonly string[]>
> = {
  'account-types': ['code', 'name'],
  users: ['email', 'full_name'],
  battalions: ['code', 'name'],
  companies: ['code', 'name'],
  personnel: [
    'personnel_code',
    'service_number',
    'email',
    'first_name',
    'middle_name',
    'last_name',
  ],

}
