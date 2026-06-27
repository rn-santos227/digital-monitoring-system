
import {
  AUDIT_TABLE_COLUMNS,
  BATTALIONS_TABLE_COLUMNS,
  COMPANIES_TABLE_COLUMNS,
  DEPLOYMENT_RECORDS_TABLE_COLUMNS,
  DEPLOYMENTS_TABLE_COLUMNS,
  ENGAGEMENT_RECORDS_TABLE_COLUMNS,
  ENGAGEMENTS_TABLE_COLUMNS,
  EQUIPMENT_ASSETS_TABLE_COLUMNS,
  EQUIPMENT_CATEGORIES_TABLE_COLUMNS,
  EQUIPMENT_ISSUANCES_TABLE_COLUMNS,
  EQUIPMENT_INCIDENTS_TABLE_COLUMNS,
  EQUIPMENT_ITEMS_TABLE_COLUMNS,
  RANK_TABLE_COLUMNS,
  SERVICE_STATUS_PERSONNEL_TABLE_COLUMNS,
  TRAINING_CATEGORIES_TABLE_COLUMNS,
  TRAINING_RECORDS_TABLE_COLUMNS,
  TRAININGS_TABLE_COLUMNS,
  USERS_ACCOUNT_TABLE_COLUMNS,
  USERS_PROFILE_TABLE_COLUMNS,
} from '~/constants/table.constants'
import type { PrintDetailFormat, PrintTableFormat } from '~/types/domain/print'

export const PRINT_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = Object.freeze({
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

export const PRINT_WINDOW_FEATURES = 'noopener,noreferrer'
export const PRINT_CSV_MIME_TYPE = 'text/csv;charset=utf-8;'
export const PRINT_GENERATED_AT_LABEL = 'Generated at:'
export const PRINT_TOTAL_RECORDS_LABEL = 'Total records:'
export const PRINT_NOT_AVAILABLE_LABEL = 'Not available'
export const PRINT_FETCH_PAGE_SIZE = 100

export const PRINT_DOCUMENT_STYLES = [
  '@page { size: landscape; margin: 12mm; }',
  'body { font-family: Arial, sans-serif; padding: 20px; color: #0f172a; }',
  'h1 { margin: 0 0 8px; font-size: 20px; }',
  'h2 { margin: 22px 0 8px; font-size: 15px; }',
  'p { margin: 0 0 16px; font-size: 12px; color: #475569; }',
  'table { width: 100%; border-collapse: collapse; font-size: 10px; }',
  'th, td { border: 1px solid #cbd5e1; padding: 6px; text-align: left; vertical-align: top; }',
  'th { background: #f1f5f9; }',
  'dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0; border: 1px solid #cbd5e1; }',
  'dl div { padding: 8px; border-bottom: 1px solid #cbd5e1; }',
  'dt { color: #475569; font-size: 10px; font-weight: 700; text-transform: uppercase; }',
  'dd { margin: 4px 0 0; font-size: 12px; }',
].join(' ')

export const PERSONNEL_PRINT_DOCUMENT_STYLES = PRINT_DOCUMENT_STYLES
export const PERSONNEL_PRINT_GENERATED_AT_LABEL = PRINT_GENERATED_AT_LABEL
export const PERSONNEL_PRINT_TOTAL_RECORDS_LABEL = PRINT_TOTAL_RECORDS_LABEL

const createTableFormat = (
  documentTitle: string,
  filePrefix: string,
  columns: PrintTableFormat['columns'],
): PrintTableFormat => Object.freeze({ documentTitle, filePrefix, columns })


export const TABLE_PRINT_FORMATS = Object.freeze({
  auditLogs: createTableFormat('Audit Logs', 'audit-logs', AUDIT_TABLE_COLUMNS),
  battalions: createTableFormat('Battalions', 'battalions', BATTALIONS_TABLE_COLUMNS),
  companies: createTableFormat('Companies', 'companies', COMPANIES_TABLE_COLUMNS),
  deploymentRecords: createTableFormat('Deployment Records', 'deployment-records', DEPLOYMENT_RECORDS_TABLE_COLUMNS),
  deployments: createTableFormat('Deployments', 'deployments', DEPLOYMENTS_TABLE_COLUMNS),
  engagementRecords: createTableFormat('Engagement Records', 'engagement-records', ENGAGEMENT_RECORDS_TABLE_COLUMNS),
  engagements: createTableFormat('Engagements', 'engagements', ENGAGEMENTS_TABLE_COLUMNS),
  equipmentAssets: createTableFormat('Equipment Assets', 'equipment-assets', EQUIPMENT_ASSETS_TABLE_COLUMNS),
  equipmentCategories: createTableFormat('Equipment Categories', 'equipment-categories', EQUIPMENT_CATEGORIES_TABLE_COLUMNS),
 equipmentIncidents: createTableFormat('Equipment Incidents', 'equipment-incidents', EQUIPMENT_INCIDENTS_TABLE_COLUMNS),
  equipmentIssuances: createTableFormat('Equipment Issuances', 'equipment-issuances', EQUIPMENT_ISSUANCES_TABLE_COLUMNS),
  equipmentItems: createTableFormat('Equipment Items', 'equipment-items', EQUIPMENT_ITEMS_TABLE_COLUMNS),
  ranks: createTableFormat('Ranks', 'ranks', RANK_TABLE_COLUMNS),
  serviceStatusPersonnel: createTableFormat('Personnel Service Status', 'personnel-service-status', SERVICE_STATUS_PERSONNEL_TABLE_COLUMNS),
  trainingCategories: createTableFormat('Training Categories', 'training-categories', TRAINING_CATEGORIES_TABLE_COLUMNS),
  trainingRecords: createTableFormat('Training Records', 'training-records', TRAINING_RECORDS_TABLE_COLUMNS),
  trainings: createTableFormat('Trainings', 'trainings', TRAININGS_TABLE_COLUMNS),
  userAccountTypes: createTableFormat('Account Types', 'account-types', USERS_ACCOUNT_TABLE_COLUMNS),
  userProfiles: createTableFormat('User Profiles', 'user-profiles', USERS_PROFILE_TABLE_COLUMNS),
})

export const PERSONNEL_DETAIL_PRINT_FORMAT = Object.freeze({
  documentTitle: 'Personnel Profile',
  filePrefix: 'personnel-profile',
  sections: Object.freeze([
    {
      title: 'Service Information',
      fields: Object.freeze([
        { key: 'personnelCode', label: 'Personnel Code' },
        { key: 'serviceNumber', label: 'Serial Number' },
        { key: 'rankName', label: 'Rank' },
        { key: 'position', label: 'Position' },
        { key: 'companyName', label: 'Company' },
        { key: 'battalionName', label: 'Battalion' },
        { key: 'serviceStatus', label: 'Service Status' },
        { key: 'employmentStatus', label: 'Employment Status' },
      ]),
    },
    {
      title: 'Personal Information',
      fields: Object.freeze([
        { key: 'fullName', label: 'Full Name' },
        { key: 'sex', label: 'Sex' },
        { key: 'birthdate', label: 'Birthdate', dataType: 'date' as const },
        { key: 'age', label: 'Age' },
        { key: 'contactNumber', label: 'Contact Number' },
        { key: 'dateEnlisted', label: 'Date Enlisted', dataType: 'date' as const },
        { key: 'createdAt', label: 'Created At', dataType: 'date' as const },
        { key: 'updatedAt', label: 'Updated At', dataType: 'date' as const },
      ]),
    },
  ])
}) satisfies PrintDetailFormat

export const EQUIPMENT_INCIDENT_DETAIL_PRINT_FORMAT = Object.freeze({
  documentTitle: 'Equipment Incident Profile',
  filePrefix: 'equipment-incident-profile',

}) satisfies PrintDetailFormat

export const EQUIPMENT_ITEM_DETAIL_PRINT_FORMAT = Object.freeze({
  documentTitle: 'Equipment Item Profile',
  filePrefix: 'equipment-item-profile',
  sections: Object.freeze([
    {
      title: 'Item Information',
      fields: Object.freeze([
        { key: 'equipmentCode', label: 'Equipment Code' },
        { key: 'name', label: 'Item Name' },
        { key: 'categoryName', label: 'Category' },
        { key: 'description', label: 'Description' },
        { key: 'unitOfMeasure', label: 'Unit of Measure' },
        { key: 'minimumStockLevel', label: 'Minimum Stock Level' },
        { key: 'isSerialized', label: 'Serialized' },
        { key: 'isActive', label: 'Active' },
        { key: 'createdAt', label: 'Created At', dataType: 'date' as const },
        { key: 'updatedAt', label: 'Updated At', dataType: 'date' as const },
      ]),
    },
  ]),
}) satisfies PrintDetailFormat
