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
  'training-categories': ['code', 'name'],
  'training-records': ['record_no'],
  'deployment-records': ['record_no'],
  'engagement-records': ['record_no'],
  'equipment-categories': ['code', 'name'],
  'equipment-items': ['equipment_code'],
  'equipment-assets': ['asset_tag', 'serial_no'],
  'equipment-issuances': ['issue_no'],
  incidents: ['incident_no'],
}
